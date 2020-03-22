import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { WindowName } from '../../meta/admin-meta';
import { NotificationItemViewModel } from '@one-core/model';
import { ToastrService } from '../../services/toastr.service';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';
import { TypeInfo } from '../widget-insight/widget-insight.component';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { AlertsMapComponent } from './alerts-map/alerts-map.component';
import { AlertsTableComponent } from './alerts-table/alerts-table.component';
import { NotificationService } from '@one-core/service/notification.service';
import { HubConnectionType, lineSeparator } from '../../../core/utils/hub.util';
import { AdminManagementService } from '../../services/admin-management.service';
import { AlertsSidebarComponent } from './alerts-sidebar/alerts-sidebar.component';
import { AlertsReportsComponent } from './alerts-reports/alerts-reports.component';
import { SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view',
  ReportsView = 'reports-view'
}

export interface IDate {
  start: string;
  end: string;
}

@Component({
  selector: 'one-admin-widget-alerts',
  templateUrl: './widget-alerts.component.html',
  styleUrls: ['./widget-alerts.component.scss']
})
export class WidgetAlertsComponent implements OnInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: false}) sidebarWindowRef: SidebarWindowComponent;
  @ViewChild(SearchKeyFilterComponent, {static: false}) searchKeyFilterRef: SearchKeyFilterComponent;
  @ViewChild(AlertsSidebarComponent, {static: false}) filterRef: AlertsSidebarComponent;
  @ViewChild(AlertsTableComponent, {static: false}) tableRef: AlertsTableComponent;
  @ViewChild(AlertsMapComponent, {static: false}) mapRef: AlertsMapComponent;
  @ViewChild(AlertsReportsComponent, {static: false}) alertsReports: AlertsReportsComponent;

  search$: Subject<any> = new Subject<any>();
  notifications: NotificationItemViewModel[] = [];
  isLoading = false;
  showNoDataModal: boolean;
  isShowLoadMoreNotifications: number;
  defaultOptionDate = 1;
  initialLoading = true;
  initialLoadingForNoDataModal = true;
  isHandleTriggeredEvent: boolean;
  sideBarFilter = '';
  searchKeyFilter = '';
  isCustomDate: boolean;
  isResolvedOn: boolean;
  View = View;
  typeDateRange: number;
  currentView: View = View.ListView;
  totalCount = 0;
  currentViewReports: number;
  customDate: IDate = {start: null, end: null};
  date: IDate = {start: null, end: null};
  newAlertCount = 0;
  currentPage = 1;
  currentPageLoadMore = 2;
  selectedStatus = 100;
  typeInfo: TypeInfo = {id: 1, type: null};
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public notificationService: NotificationService,
    private adminService: AdminManagementService,
    private toastr: ToastrService
  ) {}
  get getCustomDate(): IDate {
    return this.customDate;
  }

  get getTypeInfo(): TypeInfo {
    return this.typeInfo;
  }

  get getDate(): IDate {
    return this.date;
  }

  get getIsCustomDate(): boolean {
    return this.isCustomDate;
  }

  get getDefaultOptionDate(): number {
    return this.defaultOptionDate;
  }

  get getCurrentViewReports(): number {
    return this.currentViewReports;
  }

  get getCurrentView(): string {
    return this.currentView;
  }

  get getIsResolvedOn(): boolean {
    return this.isResolvedOn;
  }

  ngOnInit(): void {
    this.adminService.triggerEvent$.pipe(
      takeUntil(this.unsubscribeAll),
      filter(x => x.windowType === WindowName.Alert),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();

    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => {
        this.load();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  changeCustomFilter(e): void {
    this.isCustomDate = false;
    this.date.start = e.date.start;
    this.date.end = e.date.end;
    this.typeDateRange = e.typeDateRange;
  }

  searchGraph(e): void {
    this.typeInfo.id = e.id;
    this.typeInfo.type = e.type;
    /*this.alertsReports.applyFilterNext();
    if (this.alertsReports) {
      this.alertsReports.getNotifyCount();
    }*/
  }

  resetGraph(e): void {
    this.selectedStatus = 100;
    if (e) {
      if (this.currentView === 'reports-view') {
        this.alertsReports.resetTypeName();
      }
    }
  }

  updateAlertsReports(e: boolean): void {
    if (e) {
      if (this.alertsReports) {
        this.alertsReports.getNotifyCount();
      }
    }
  }

  customFilterSelected(e): void {
    this.isCustomDate = true;
    this.customDate.start = e.start;
    this.customDate.end = e.end;
  }

  selectedStatusOut(e): void {
    this.selectedStatus = e;
  }

  changeFilterGraph(e): void {
    if (this.alertsReports) {
      this.alertsReports.applyFilterNext(e);
    }
  }

  async loadMoreNotifications(): Promise<void> {
    try {
      this.isLoading = true;
      const sidebar = this.sideBarFilter ? ` and (${this.sideBarFilter})` : '';
      const searchKey = this.searchKeyFilter ? ` and ${this.searchKeyFilter}` : '';
      const res = await this.notificationService
        .getNotifications(`${sidebar}${searchKey}`, this.currentPageLoadMore, 20, +this.selectedStatus === 100 ? 'createdAt' : 'resolvedOn')
        .toPromise();
      this.isShowLoadMoreNotifications = res.results.length;
      if (res.results.length > 0) {
        const sortedData = this.sorByCreatedAtDate(res.results);
        this.currentPageLoadMore++;
        this.notifications.push(lineSeparator(HubConnectionType.Notification));
        this.notifications.push(...sortedData);
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  load(): void {
    this.isLoading = true;
    const sidebar = this.sideBarFilter ? ` and (${this.sideBarFilter})` : '';
    const searchKey = this.searchKeyFilter ? ` and ${this.searchKeyFilter}` : '';
    this.notificationService
      .getNotifications(`${sidebar}${searchKey}`, this.currentPage, 20, +this.selectedStatus === 100 ? 'createdAt' : 'resolvedOn')
      .subscribe(
        res => {
          if (this.initialLoadingForNoDataModal) {
            if (!this.notifications.length) {
              this.showNoDataModal = true;
            }
            this.initialLoadingForNoDataModal = false;
          }
          if (res.results.length > 0) {
            this.showNoDataModal = false;
            res.results.map((item) => {
              this.isResolvedOn = !!item.resolvedOn;
            });
            if (this.isResolvedOn) {
              this.sorByResolvedDate(res.results);
            } else {
              this.notifications = this.sorByCreatedAtDate(res.results);
            }
          } else {
            this.notifications = [];
          }
          this.isShowLoadMoreNotifications = res.results.length;
          if (this.notifications.length === 1) {
            setTimeout(() => {
              if (this.tableRef) {
                this.tableRef.table.expandRow(this.tableRef.table.data[0]);
              }
            }, 400);
          }
          this.totalCount = res.count;
          // refresh view - remove line separator and notification
          this.newAlertCount = 0;
          if (this.tableRef) {
            this.tableRef.lineSeparatorAdded = false;
          }
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.toastr.error(null, error);
        }
      );
  }

  sorByResolvedDate(data: Array<any>) {
    const sorted = data.sort((val1, val2) => {
      return new Date(val2.resolvedOn).getTime() - new Date(val1.resolvedOn).getTime();
    });
    this.notifications = [];
    sorted.map((item) => {
      item.duration = this.secondsToDhms(this.millisToSeconds(new Date(item.resolvedOn).getTime() - new Date(item.createdAt).getTime()));
      this.notifications.push(item);
    });
  }

  millisToSeconds(millis) {
    return millis / 1000;
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const hDisplay = h < 10 ? '0' + h : h;
    const mDisplay = m < 10 ? '0' + m : m;
    const sDisplay = s < 10 ? '0' + s : s;
    return `${d}:${hDisplay}:${mDisplay}:${sDisplay}`;
  }

  sorByCreatedAtDate(data: Array<any>) {
    const sorted = data.sort((val1, val2) => {
      return new Date(val2.createdAt).getTime() - new Date(val1.createdAt).getTime();
    });
    return sorted;
  }

  toggleOverlaySidebar(e): void {
    if (e) {
      this.showNoDataModal = false;
    }
  }

  changeFilterSearchPressKey(e): void {
    this.searchKeyFilter = e;
  }

  changeFilterClearAll(e): void {
    if (e) {
      this.searchKeyFilter = null;
      this.filterRef.clickResetBtn();
    }
  }

  changeSearchKeyFilter(filters): void {
    this.searchKeyFilter = filters;
    if (!this.initialLoading && filters !== '') {
      this.search$.next();
    }
  }

  changeSidebarFilter(filters): void {
    this.sideBarFilter = filters;
    if (this.initialLoading) {
      setTimeout(() => {
        this.initialLoading = false;
      }, 1000);
      this.search$.next();
    }
  }

  changeFilterBtn(filters): void {
    this.currentPageLoadMore = 2;
    this.sideBarFilter = filters;
    if (this.currentView === View.ListView) {
      this.search$.next();
    }
  }

  openImage(src): void {
    if (src) {
      this.sidebarWindowRef.openImageModal(src);
    }
  }

  closeSidebar(e): void {
    if (e) {
      this.sidebarWindowRef.closeSidebar();
    }
  }

  openDetail(data): void {
    this.sidebarWindowRef.openDetailModal(data);
  }

  toggleView(view: View): void {
    this.currentView = view;
    this.newAlertCount = 0;
    if (this.currentView === View.ListView) {
      this.currentViewReports = null;
      this.currentPage = 1;
      this.search$.next();
    } else if (this.currentView === View.MapView) {
      this.currentViewReports = null;
    } else if (this.currentView === View.ReportsView) {
      this.typeInfo.id = 1;
      this.currentViewReports = 1;
      this.showNoDataModal = false;
      setTimeout(() => {
        //  this.alertsReports.applyFilterNext();
      }, 300);
    }
  }

  newAlertArrived(): void {
    this.showNoDataModal = false;
    this.newAlertCount += 1;
  }

  viewNewItems(): void {
    if (this.currentView === View.MapView) {
      this.toggleView(View.ListView);
    } else {
      this.newAlertCount = 0;
      if (this.tableRef) {
        this.tableRef.displayNewAlerts();
      }
    }
  }

  showSideBar(): void {
    this.showNoDataModal = false;
    this.sidebarWindowRef.sidebarOpened();
  }

  private handleTriggeredEvent(e): void {
    if (e) {
      this.isHandleTriggeredEvent = true;
    }
    this.currentView = View.ListView;
    switch (e.message) {
      case EVENT_MESSAGE.NOTIFICATION_FILTER_BY_SELECTED_ID: {
        if (e.data.id) {
          this.sideBarFilter = `id eq ${e.data.id}`;
          this.searchKeyFilterRef.clear();
        } else {
          this.searchKeyFilterRef.search(e.data.identifier);
        }
        break;
      }
      case EVENT_MESSAGE.NOTIFICATION_FILTER_BY_SELECTED_IDENTIFIER: {
        if (this.filterRef && this.filterRef.dateRangeFilter) {
          // this.filterRef.dateRangeFilter.clear();
        }
        this.defaultOptionDate = 3;
        this.searchKeyFilterRef.search(e.data.identifier);
        setTimeout(() => {
          this.search$.next();
        }, 200);
        break;
      }
      case EVENT_MESSAGE.NOTIFICATION_OPEN_WITHOUT_ANY_FILTER: {
        this.sideBarFilter = 'status eq 100';
        this.searchKeyFilterRef.clear();
        break;
      }
      case EVENT_MESSAGE.NOTIFICATION_FILTER_BY_PRIORITY: {
        this.defaultOptionDate = 3;
        this.searchKeyFilterRef.clear();
        this.filterRef.changePriorityFilter(e.data);
        setTimeout(() => {
          this.search$.next();
        }, 300);
        break;
      }
      default: {
        if (e.data.id) {
          this.sideBarFilter = `eventId eq ${e.data.id}`;
          this.searchKeyFilterRef.clear();
        } else {
          this.searchKeyFilterRef.search(e.data.identifier);
        }
        break;
      }
    }
  }
}
