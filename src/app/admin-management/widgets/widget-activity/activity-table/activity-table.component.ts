import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { WindowName } from '../../../meta/admin-meta';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { HubService } from '@one-core/service/hub.service';
import { EventService } from '@one-core/service/event.service';
import { ToastrService } from '../../../services/toastr.service';
import { EVENT_MESSAGE } from '../../../meta/admin-event-message';
import { AdminManagementService } from '../../../services/admin-management.service';
import { EventDetail, EventHub, EventListItem, IdentifierType } from '@one-core/model';
import { getActivityFromHistoryHub, HubConnectionType, lineSeparator } from '../../../../core/utils/hub.util';
import { CellType, ExpansionTableColumnInfo } from '@one-common/ui-kit/expansion-table/expansion-table.component';
import { isEntryExists } from '../../../../core/utils/common.util';
import { ActionService } from '@one-core/service/action.service';

export enum View {
  MapView = 'map-view',
  ActivityView = 'activity-view',
  DetailView = 'detail-view',
  ActionsView = 'actions-view',
  PeopleView = 'people-view',
  GroupView = 'group-view'
}

@Component({
  selector: 'one-admin-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit, OnDestroy {

  @Input() history: EventListItem[] = [];
  @Output() openImage: EventEmitter<string> = new EventEmitter<string>();
  @Output() openDetail: EventEmitter<any> = new EventEmitter();
  @Output() newActivityArrived: EventEmitter<any> = new EventEmitter();
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('typeImage', {static: true}) typeImage;
  @ViewChild('carImage', {static: true}) carImage;
  @ViewChild('peopleImage', {static: true}) peopleImage;

  selectedEvent: EventDetail;
  isEventLoading = false;
  scrollTop: boolean;
  isAction: boolean;
  displayColumns: ExpansionTableColumnInfo[] = [];
  View = View;
  newActivity: EventListItem[] = [];
  currentView: View = View.MapView;
  actions: Array<any> = [];
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private adminService: AdminManagementService,
    private eventService: EventService,
    private actionService: ActionService,
    private hubService: HubService,
    private toastr: ToastrService,
  ) {
  }

  get getActions() {
    return this.actions;
  }

  get getScrollTop(): boolean {
    return this.scrollTop;
  }

  ngOnInit(): void {
    this.actionService.getActions(``).subscribe((res) => {
      this.setActions(res.results);
    }, (err) => console.error(err));
    this.displayColumns = [
      {
        name: 'historyItemSource', label: 'Identifier', width: '19%', classes: 'selectable',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.carImage}
      },
      /* {
         name: 'identifier', label: 'Identifier', width: '15%',
         header: {type: CellType.default},
         content: {type: CellType.default}
       },*/
      {
        name: 'site', label: 'Site', width: '', classes: 'full',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'source', label: 'Source', width: '10%', classes: 'full',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'triggerCondition', label: 'Condition', width: '10%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'peopleImage', label: '', width: '5%',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.peopleImage}
      },
      {
        name: 'createdAt', label: 'Created', width: '90px',
        header: {type: CellType.default},
        content: {type: CellType.date}
      },
    ];

    this.hubService.getHubStreamByType(HubConnectionType.History).pipe(
      takeUntil(this.unsubscribeAll),
      filter((data: EventHub) => data.identifierTypeId !== IdentifierType.Video),
      tap(x => {
        // if current view is resolved view then don't need to add notification to the window
        this.history = this.history ? this.history : [];
        if (this.history) {
          const activity = getActivityFromHistoryHub(x);
          if (!isEntryExists(this.newActivity, 'id', activity.id) && !isEntryExists(this.history, 'id', activity.id)) {
            this.newActivity.unshift(activity);
            this.newActivityArrived.emit();
          }
        }
      })
    ).subscribe();
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
    if (this.selectedEvent.actionId) {
      item.actionId = this.selectedEvent.actionId;
    }
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
      isActivity: true,
      isAlerts: false,
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

  displayNewActivities(): void {
    if (this.history) {
      const index = this.history.findIndex(x => !x.id);
      if (index > -1) {
        this.history.splice(index, 1);
      }
      const newActivity = this.sorByCreatedAtDate(this.newActivity);
      this.history.unshift(lineSeparator(HubConnectionType.History));
      this.history.unshift(...newActivity);
      this.newActivity = [];
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

  openWindow(window, item: any): void {
    this.adminService.openAdminSubWindow(window);
  }

  openNotificationWindow(item): void {
    const notificationData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.NOTIFICATION_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.Alert, false, notificationData);
  }

  openActionWindow(item): void {
    const actionFilterData = {
      triggerInside: true,
      data: item,
      message: EVENT_MESSAGE.ACTION_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminService.openAdminSubWindow(WindowName.Control, false, actionFilterData);
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

  expandRow(e) {
    this.currentView = View.MapView;
    this.selectedEvent = null;
    this.closeSidebar.emit(true);
    this.isEventLoading = true;
    const action = this.actions.filter((item) => item.identifiers.indexOf(e.identifier) > -1);
    this.isAction = action.length > 0;
    this.eventService.getEventById(e.id).subscribe((res) => {
      this.selectedEvent = res;
      if (action.length > 0) {
        this.selectedEvent.actionId = action[0].id;
      }
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
      if (this.selectedEvent.identifierTypeValue) {
        this.selectedEvent.identifierType = this.selectedEvent.identifierTypeValue;
      }
      /* this.history.map((item) => {
          if (item.eventId === e.eventId) {
            this.selectedEvent.actionReason = item.actionReason;
            this.selectedEvent.type = item.type;
            this.selectedEvent.identifierType = item.identifierType;
          }
        });*/
      this.isEventLoading = false;
    }, (err) => {
      this.toastr.error(null, err);
      this.isEventLoading = false;
    });
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
  private setActions(actions: Array<any>): void {
    actions.map(item => {
      if (item.identifiers) {
        this.actions.push(item);
      }
    });
  }
}
