import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// One - Services
import { Subject } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { filter, takeUntil } from 'rxjs/operators';
import { WindowName } from '../../meta/admin-meta';
import { EventDetail, EventListItem } from '@one-core/model';
import { EventService } from '@one-core/service/event.service';
import { sliderQue } from '@one-animation/sliderQue.animation';
import { shrinkInOut } from '@one-animation/common.animations';
import { ToastrService } from '../../services/toastr.service';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';

import { ActionService } from '@one-core/service/action.service';
import { Locate, LocateService } from './services/locate.service';

import { LocateMapComponent } from './locate-map/locate-map.component';
import { ExpansionTableItem } from '../../../core/utils/expansion-table.util';
import { LocateFilterComponent } from './locate-filter/locate-filter.component';
import { AdminManagementService } from '../../services/admin-management.service';
import { LocateSearchBoxComponent } from './locate-search-box/locate-search-box.component';
import { SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';

export enum View {
  ImageView = 'image-view',
  ActivityView = 'activity-view',
  DetailView = 'detail-view',
  ActionsView = 'actions-view',
}


@Component({
  selector: 'one-admin-widget-locate',
  templateUrl: './widget-locate.component.html',
  styleUrls: ['./widget-locate.component.scss'],
  animations: [sliderQue(), shrinkInOut()]
})
export class WidgetLocateComponent implements AfterViewInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: false}) sidebarWindowRef: SidebarWindowComponent;
  @ViewChild(LocateMapComponent, {static: false}) mapRef: LocateMapComponent;
  @ViewChild(LocateSearchBoxComponent, {static: false}) searchBox: LocateSearchBoxComponent;
  @ViewChild(LocateFilterComponent, {static: false}) filterRef: LocateFilterComponent;

  showSidebar = true;
  hideSidebarButton = true;
  isEventLoading = false;
  filterString = '';
  locate: Locate = {};
  selectedPosition = null;
  selectedEvent: EventDetail;
  selectedListItem: EventListItem;
  defaultOptionDate = 1;
  actionId: string;
  isHandleTriggeredEvent: boolean;
  currentView: View = View.ImageView;
  View = View;
  actions: Array<any> = [];

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private library: FaIconLibrary,
    public locateService: LocateService,
    private adminService: AdminManagementService,
    private eventService: EventService,
    private actionService: ActionService,
    private toastr: ToastrService
  ) {
    this.library.addIcons(faArrowLeft, faArrowRight);
  }

  get getDefaultOptionDate(): number {
    return this.defaultOptionDate;
  }

  ngAfterViewInit() {
    this.actionService.getActions(``).subscribe((res) => {
      this.setActions(res.results);
    }, (err) => console.error(err));
    setTimeout(() => {
      this.adminService.boxCloseEventSubject$.pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
        if (data.box.title === 'Locate') {
          this.clear();
          this.locateService.locate$.next(this.locate);
        }
      });
      this.locateService.locate$.pipe(takeUntil(this.unsubscribeAll)).subscribe(locate => {
        this.locate = locate;
        this.showSidebar = !!locate.identifier;
        this.toggleFirstItem();
      });

      this.adminService.triggerEvent$.pipe(filter(x => x.windowType === WindowName.Locate), takeUntil(this.unsubscribeAll)).subscribe(data => {
        this.handleTriggeredEvent(data.data);
      });
    }, 200);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  isEventDetailed(): boolean {
    return [
      View.DetailView,
      View.ActionsView,
      View.ActivityView
    ].indexOf(this.currentView) !== -1;
  }

  onExpand(item) {
    if (item.data.identifier) {
      const action = this.actions.filter((itm) => itm.identifiers.indexOf(item.data.identifier) > -1);
      this.actionId = action[0].id;
    }
    switch (this.currentView) {
      case View.DetailView:
        this.sidebarWindowRef.openDetailModal(this.selectedEvent);
        break;
      case View.ActionsView:
        this.openWindows('actions');
        break;
      case View.ActivityView:
        this.openWindows('activity');
        break;
      default:
        break;
    }
  }

  eventDetailedConfig() {
    const config: any = {
      data: this.selectedEvent,
      isLocate: true,
      isAlerts: false,
      isActivity: false,
      isLoading: this.isEventLoading
    };
    switch (this.currentView) {
      case View.DetailView:
        config.isDetail = true;
        break;
      case View.ActionsView:
        config.isDetailActions = true;
        break;
      case View.ActivityView:
        config.isDetailActivity = true;
        break;
      default:
        break;
    }
    return config;
  }

  isSearchFInvalid(e): void {
    setTimeout(() => {
      this.hideSidebarButton = !e;
    }, 200);
  }

  clear(): void {
    this.locate = {};
    this.selectedPosition = {lat: -34, long: 151};
    this.searchBox.noResult = true;
    this.showSidebar = false;
    this.searchBox.searchForm.get('searchKey').setValue('');
    this.locateService.currentPage = 1;
    this.locateService.totalCount = 0;
    this.filterRef.dateFilter.clear();
  }

  openWindows(e): void {
    const actionFilterData = {
      triggerInside: true,
      data: {identifier: this.searchBox.searchForm.get('searchKey').value, actionId: this.actionId},
      message: EVENT_MESSAGE.ACTION_FILTER_BY_SELECTED_IDENTIFIER
    };
    if (e === WindowName.Activity) {
      actionFilterData.message = EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER;
    } else if (e === WindowName.Control) {
      actionFilterData.message = EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER;
    }
    this.adminService.openAdminSubWindow(e, false, actionFilterData);
  }

  changeFilter(e) {
    /*setTimeout(() => {
      this.filterString = e;
    }, 100);
    */
  }

  changeFilterBtn(e, keepPage = false): void {
    setTimeout(() => {
      this.filterString = e;
    }, 100);
    setTimeout(() => {
      setTimeout(() => {
        const identifier = this.searchBox.searchForm.get('searchKey').value;
        if (identifier) {
          // TODO: wait for data binding
          setTimeout(() => {
            this.searchBox.search(identifier, keepPage);
          }, 100);
        }
      }, 500);
    }, 1000);
  }

  pageChanged(e: PageChangedEvent): void {
    this.locateService.currentPage = e.page;
    // this.changeFilter(this.filterString, true);
  }

  async togglePanel(item: ExpansionTableItem<EventListItem>, changePosition = true): Promise<void> {
    try {
      const temp = item.expanded;
      if (this.locate.history) {
        this.locate.history.forEach(x => x.expanded = false);
        item.expanded = !temp;
      }
      if (!temp) {
        this.isEventLoading = true;
        this.selectedEvent = null;
        this.selectedEvent = await this.eventService.getEventById(item.data.id).toPromise();
        this.selectedListItem = item.data;
        // get position from detail
        this.selectedPosition = {lat: this.selectedEvent.latitude, long: this.selectedEvent.longitude, id: this.selectedEvent.id};
        // get address from detail
        if (changePosition) {
          this.mapRef.changePosition();
        }
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isEventLoading = false;
    }
  }

  private handleTriggeredEvent(data: { message: string, data: any, windowType: string }): void {
    this.isHandleTriggeredEvent = true;
    this.defaultOptionDate = 8;
    switch (data.message) {
      case EVENT_MESSAGE.LOCATE_SHOW_EVENT_NUMBERPLATE: {
        if (data.data.historyItemSource) { // if user come from the history window (activity window)
          this.searchBox.searchForm.get('identifierType').setValue(data.data.historyItemSource);
        } else { // if user come from the alert window
          this.searchBox.searchForm.get('identifierType').setValue(data.data.identifierTypeId);
        }
        setTimeout(() => {
          this.searchBox.search(data.data.identifier, false, false);
        }, 400);
        break;
      }
      default:
        return;
    }
  }

  private toggleFirstItem(): void {
    if (this.locate && this.locate.history && this.locate.history.length) {
      this.togglePanel(this.locate.history[0], false);
    }
  }
  private setActions(actions: Array<any>): void {
    actions.map(item => {
      if (item.identifiers) {
        this.actions.push(item);
      }
    });
  }
}
