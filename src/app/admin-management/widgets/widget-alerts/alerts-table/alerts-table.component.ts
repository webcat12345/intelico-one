import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// One - Services
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { HubService } from '@one-core/service/hub.service';
import { UserService } from '@one-core/service/user.service';
import { EventService } from '@one-core/service/event.service';
import { ToastrService } from '../../../services/toastr.service';
import { ActionService } from '@one-core/service/action.service';
import { EVENT_MESSAGE } from '../../../meta/admin-event-message';
import { TypeCategory, TypesService } from '@one-core/service/types.service';
import { AdminManagementService } from '../../../services/admin-management.service';
import { IUsersTeams, NotificationService } from '@one-core/service/notification.service';

import { WindowName } from '../../../meta/admin-meta';
import { LocalStorageService } from 'angular-2-local-storage';
import { getNotificationFromSocketData, HubConnectionType, lineSeparator } from '../../../../core/utils/hub.util';
import { environment } from '../../../../../environments/environment';
import { EventDetail, NotificationItemViewModel, NotificationStatus, Resolve } from '@one-core/model';
import { CellType, ExpansionTableColumnInfo, ExpansionTableComponent } from '@one-common/ui-kit/expansion-table/expansion-table.component';

export enum View {
  MapView = 'map-view',
  ActivityView = 'activity-view',
  DetailView = 'detail-view',
  ActionsView = 'actions-view',
  PeopleView = 'people-view',
  GroupView = 'group-view'
}

@Component({
  selector: 'one-admin-alerts-table',
  templateUrl: './alerts-table.component.html',
  styleUrls: ['./alerts-table.component.scss']
})
export class AlertsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() notifications: NotificationItemViewModel[];
  @Input() isResolvedOn: boolean;

  @Output() openImage: EventEmitter<string> = new EventEmitter<string>();
  @Output() openDetail: EventEmitter<any> = new EventEmitter();
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter();
  @Output() newAlertArrived: EventEmitter<any> = new EventEmitter();

  @ViewChild('typeCell', {static: true}) typeCell: TemplateRef<any>;
  @ViewChild('priorityBadge', {static: true}) priorityBadge: TemplateRef<any>;
  @ViewChild('peopleImage', {static: true}) peopleImage;
  @ViewChild(ExpansionTableComponent, {static: true}) table: ExpansionTableComponent;

  NotificationStatus = NotificationStatus;
  alertsResolveForm: FormGroup;
  usersTeams: Array<IUsersTeams> = this.localStorageService.get(environment.localStorage.users_teams);
  previousActionId: string;
  isLoading = false;
  scrollTop: boolean;
  isAction: boolean;
  isEventLoading = false;
  lineSeparatorAdded = false;
  View = View;
  currentView: View = View.MapView;
  displayColumns: ExpansionTableColumnInfo[] = [];
  reasons: any[] = [];
  selectedEvent: EventDetail;
  resolveReason: Resolve = {reason: {id: null, description: ''}, comment: ''};
  newAlerts: NotificationItemViewModel[] = [];
  actions: Array<any> = [];
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private notificationService: NotificationService,
    private typeService: TypesService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private adminService: AdminManagementService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private hubService: HubService,
    private toastr: ToastrService,
    private actionService: ActionService
  ) {
  }

  get getActions() {
    return this.actions;
  }

  get getScrollTop(): boolean {
    return this.scrollTop;
  }

  ngOnInit() {
    this.actionService.getActions(``).subscribe((res) => {
      this.actions = res.results;
    }, (err) => console.error(err));
    this.getReasons();
    this.hubService.getHubStreamByType(HubConnectionType.Notification).pipe(
      takeUntil(this.unsubscribeAll),
      tap(x => {
        // if current view is resolved view then don't need to add notification to the window
        this.notifications = this.notifications ? this.notifications : [];
        if (this.notifications) {
          if (this.usersTeams) {
            this.usersTeams.map(item => {
              item.actionIds.map(it => {
                if (it === x.actionId) {
                  if (this.previousActionId !== x.actionId) {
                    this.newAlerts.unshift(getNotificationFromSocketData(x));
                    this.newAlertArrived.emit();
                  }
                  this.previousActionId = it;
                }
              });
            });
          } else {
            this.newAlerts.unshift(getNotificationFromSocketData(x));
            this.newAlertArrived.emit();
          }
        }
        /* if (!this.notifications.length || this.notifications[0].status !== NotificationStatus.Resolved) {
           if (!this.lineSeparatorAdded) {
             // add line separator for new alert indicator
             this.notifications.unshift(lineSeparator(HubConnectionType.Notification));
             this.lineSeparatorAdded = true;
           }
           this.notifications.unshift(getNotificationFromSocketData(x));
           this.newAlertArrived.emit();
         }*/
      })
    ).subscribe();
    this.alertsResolveForm = this.formBuilder.group({
      alertsResolve: ['-1', Validators.required],
      alertsComments: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    this.setDisplayColumns(this.isResolvedOn);
  }

  setDisplayColumns(resolveReason: boolean) {
    if (resolveReason) {
      this.displayColumns = [
        {
          name: 'historyItemSource', label: 'Identifier', width: '19%', classes: 'selectable',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.typeCell},
        },
        {
          name: 'priority', label: 'Priority', width: '85px',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.priorityBadge}
        },
        {
          name: 'site', label: 'Site', width: '19%',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          name: 'source', label: 'Source', width: '19%',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          // action name should be displayed as reason https://trello.com/c/lQ95FnUg/105-actions-cannot-delete-a-created-action
          name: 'actionReason', label: 'Reason', classes: 'full',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          name: 'Duration', label: 'Duration', width: '86px',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          name: 'peopleImage', label: '', width: '5%',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.peopleImage}
        },
        {
          name: 'createdAt', label: 'Created', width: '86px',
          header: {type: CellType.default},
          content: {type: CellType.date}
        }
      ];
    }
    if (!resolveReason) {
      this.displayColumns = [
        {
          name: 'historyItemSource', label: 'Identifier', width: '19%', classes: 'selectable',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.typeCell},
        },
        {
          name: 'priority', label: 'Priority', width: '85px',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.priorityBadge}
        },
        {
          name: 'site', label: 'Site', width: '19%',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          name: 'source', label: 'Source', width: '23%',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          // action name should be displayed as reason https://trello.com/c/lQ95FnUg/105-actions-cannot-delete-a-created-action
          name: 'actionReason', label: 'Reason', classes: 'full',
          header: {type: CellType.default},
          content: {type: CellType.default}
        },
        {
          name: 'peopleImage', label: '', width: '5%',
          header: {type: CellType.default},
          content: {type: CellType.template, templateRef: this.peopleImage}
        },
        {
          name: 'createdAt', label: 'Created', width: '86px',
          header: {type: CellType.default},
          content: {type: CellType.date}
        }
      ];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  isEventDetailed(): boolean {
    return [
      View.DetailView,
      View.ActionsView,
      View.ActivityView,
      View.PeopleView,
      View.GroupView
    ].indexOf(this.currentView) !== -1;
  }

  onExpand(item) {
    switch (this.currentView) {
      case View.DetailView:
        this.openDetail.emit(this.selectedEvent);
        break;
      case View.ActionsView:
        this.openActionWindow(item);
        break;
      case View.ActivityView:
        this.openHistoryWindow(item);
        break;
      case View.PeopleView:
        this.openPeopleWindow(item);
        break;
      case View.GroupView:
        this.openGroupsWindow(item);
        break;
      default:
        break;
    }
  }

  eventDetailedConfig() {
    const config: any = {
      data: this.selectedEvent,
      isLoading: this.isEventLoading,
      isAlerts: true,
      isActivity: false,
    };
    switch (this.currentView) {
      case View.DetailView:
        config.isDetail = true;
        config.hideExpand = true;
        break;
      case View.ActionsView:
        config.isDetailActions = true;
        break;
      case View.ActivityView:
        config.isDetailActivity = true;
        break;
      case View.PeopleView:
        config.isDetailPeople = true;
        break;
      case View.GroupView:
        config.isDetailGroup = true;
        break;
      default:
        break;
    }
    return config;
  }

  onchangeAlertsResolve(e): void {
    if (e) {
      this.reasons.map((item) => {
        if (item.value === e) {
          this.resolveReason.reason.id = item.id;
          this.resolveReason.reason.description = item.value;
        }
      });
    }
  }

  onchangeAlertsComments(e): void {
    this.resolveReason.comment = e;
  }

  async resolveNotification(item: NotificationItemViewModel): Promise<void> {
    try {
      this.isLoading = true;
      const res: any = await this.userService.getAccount().toPromise();
      await this.notificationService.resolveNotification(item.id, this.resolveReason.reason, this.resolveReason.comment, res.item.id).toPromise();
      item.status = NotificationStatus.Resolved;
      item.expanded = false;
      await setTimeout(async () => {
        const index = this.notifications.findIndex(x => x.id === item.id);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
        this.notificationService.notificationResolved$.emit(item);
        this.toastr.success('Successfully resolved notification.');
        this.alertsResolveForm.get('alertsResolve').setValue(-1);
        this.alertsResolveForm.get('alertsComments').setValue('');
        this.resolveReason.reason = {id: '', description: ''};
        this.resolveReason.comment = '';
      }, 300);
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async getReasons(): Promise<void> {
    try {
      this.reasons = await this.typeService.getTypesForResolved(TypeCategory.Resolved).pipe(map((x: any) => x.data)).toPromise() as any;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
    }
  }

  async expandRow(e): Promise<void> {
    try {
      this.alertsResolveForm.get('alertsResolve').setValue(-1);
      this.alertsResolveForm.get('alertsComments').setValue('');
      this.currentView = View.MapView;
      this.closeSidebar.emit(true);
      this.selectedEvent = null;
      this.isEventLoading = true;
      const action = this.actions.filter((item) => item.identifiers.indexOf(e.identifier) > -1);
      this.isAction = action.length > 0;
      this.selectedEvent = await this.eventService.getEventById(e.eventId).toPromise();
      // when alert triggered from an action which is using meta data, there shouldn't be any matching identifier, but action exists
      this.isAction = Boolean(this.selectedEvent.possibleActions && this.selectedEvent.possibleActions.length);

      if (e.resolvedComment) {
        this.selectedEvent.resolvedComment = e.resolvedComment;
      }
      this.selectedEvent.actionId = e.actionId;
      this.selectedEvent.personDetails = {
        address: {
          city: null,
          country: null,
          county: null,
          latitude: null,
          line1: null,
          line2: null,
          longitude: null,
          postCode: null
        },
        createdDate: null,
        firstName: null,
        groups: [{id: null, name: null}],
        id: null,
        identifiers: [{id: null, identifierTypeId: null, value: null}, {id: null, identifierTypeId: null, value: null}],
        lastName: null
      };
      this.notifications.map((item) => {
        if (item.eventId === e.eventId) {
          this.selectedEvent.type = item.type;
          this.selectedEvent.identifierType = item.identifierType;
        }
      });
      this.notifications.map((item) => {
        if (item.actionId === e.actionId) {
          this.selectedEvent.actionReason = item.actionReason;
        }
      });
      const detail: any = await this.notificationService.getNotificationById(e.id).toPromise();
      e.comment = detail.comment;
      this.isEventLoading = false;
    } catch (e) {
    } finally {
    }
  }

  displayNewAlerts(): void {
    if (this.notifications) {
      const index = this.notifications.findIndex(x => !x.id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
      const newAlerts = this.sorByCreatedAtDate(this.newAlerts);
      this.notifications.unshift(lineSeparator(HubConnectionType.Notification));
      this.notifications.unshift(...newAlerts);
      this.newAlerts = [];
      this.scrollTop = true;
      setTimeout(() => {
        this.scrollTop = false;
      }, 10);
    }
  }

  sorByCreatedAtDate(data: Array<any>) {
    const sorted = data.sort((val1, val2) => {
      return new Date(val2.createdAt).getTime() - new Date(val1.createdAt).getTime();
    });
    return sorted;
  }

  openLocateWindow(item, e): void {
    e.stopPropagation();
    const locateData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.LOCATE_SHOW_EVENT_NUMBERPLATE
    };
    this.adminService.openAdminSubWindow(WindowName.Locate, false, locateData);
  }

  openActionWindow(item): void {
    const actionFilterData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.ACTION_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.Control, false, actionFilterData);
  }

  openHistoryWindow(item): void {
    const actionFilterData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.Activity, false, actionFilterData);
  }

  openPeopleWindow(item): void {
    const actionFilterData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.People, false, actionFilterData);
  }

  openGroupsWindow(item): void {
    const actionFilterData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.AdminGroups, false, actionFilterData);
  }
}
