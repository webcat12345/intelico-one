import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { EventListItem } from '@one-core/model';
import { WindowName } from '../../meta/admin-meta';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from '../../services/toastr.service';
import { pushEntries } from '../../../core/utils/common.util';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';
import { shrinkInOut } from '@one-animation/common.animations';
import { IDate } from '../widget-alerts/widget-alerts.component';
import { HistoryService } from '@one-core/service/history.service';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { TypeInfo } from '../widget-insight/widget-insight.component';
import { ActivityMapComponent } from './activity-map/activity-map.component';
import { HubConnectionType, lineSeparator } from '../../../core/utils/hub.util';
import { AdminManagementService } from '../../services/admin-management.service';
import { ActivityTableComponent } from './activity-table/activity-table.component';
import { ActivityFilterComponent } from './activity-filter/activity-filter.component';
import { ActivityReportsComponent } from './activity-reports/activity-reports.component';
import { SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view',
  ReportsView = 'reports-view'
}

@Component({
  selector: 'one-admin-widget-activity',
  templateUrl: './widget-activity.component.html',
  styleUrls: ['./widget-activity.component.scss'],
  animations: [
    shrinkInOut()
  ]
})

export class WidgetActivityComponent implements OnInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: false}) sidebarWindowRef: SidebarWindowComponent;
  @ViewChild(ActivityFilterComponent, {static: false}) filterRef: ActivityFilterComponent;
  @ViewChild(SearchKeyFilterComponent, {static: false}) searchKeyFilterRef: SearchKeyFilterComponent;
  @ViewChild(ActivityTableComponent, {static: false}) tableRef: ActivityTableComponent;
  @ViewChild(ActivityMapComponent, {static: false}) mapRef: ActivityMapComponent;
  @ViewChild(ActivityReportsComponent, {static: false}) activityReports: ActivityReportsComponent;

  View = View;
  currentView: View = View.ListView;
  currentViewReports: number;
  isLoading = false;
  showNoDataModal: boolean;
  isShowLoadMoreHistory: number;
  initialLoading = true;
  search$: Subject<any> = new Subject<any>();
  searchKeyFilter = '';
  peopleId: string;
  histories: EventListItem[] = [];
  sideBarFilter = '';
  customDate: IDate = {start: null, end: null};
  date: IDate = {start: null, end: null};
  typeInfo: TypeInfo = {id: 111, type: null};
  locationInfo = '';
  isCustomDate: boolean;
  initialLoadingForNoDataModal = true;
  currentPage = 1;
  totalCount = 0;
  newActivityCount = 0;
  currentPageLoadMore = 2;
  startDate: string;
  endDate: string;
  historiesThroughPagination: EventListItem[] = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public historyService: HistoryService,
    private adminService: AdminManagementService,
    private toastr: ToastrService
  ) {
  }

  get getCurrentView(): string {
    return this.currentView;
  }

  get getCurrentViewReports(): number {
    return this.currentViewReports;
  }

  get getCustomDate(): IDate {
    return this.customDate;
  }

  get getDate(): IDate {
    return this.date;
  }

  get getIsCustomDate(): boolean {
    return this.isCustomDate;


  }

  get getTypeInfo(): TypeInfo {
    return this.typeInfo;
  }

  ngOnInit(): void {
    this.adminService.triggerEvent$.pipe(
      takeUntil(this.unsubscribeAll),
      filter(x => x.windowType === WindowName.Activity),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();

    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.load())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  changeFilterGraph(e): void {
    if (this.activityReports) {
      this.activityReports.applyFilterNext(e);
    }
  }

  searchGraph(e): void {
    this.typeInfo.id = e.id;
    this.typeInfo.type = e.type;
  }

  resetGraph(e): void {
    if (e) {
      if (this.currentView === 'reports-view') {
        this.activityReports.resetChart();
      }
    }
  }

  loadMoreHistory() {
    this.isLoading = true;
    const sidebarFilter = this.sideBarFilter ? ` and ${this.sideBarFilter}` : '';
    const searchKey = this.searchKeyFilter ? ` and ${this.searchKeyFilter}` : '';
    this.historyService.getHistories(`${sidebarFilter}${searchKey}`, this.currentPageLoadMore).subscribe((res) => {
      const length = res.results.length;
      this.isShowLoadMoreHistory = length;
      if (length > 0) {
        this.currentPageLoadMore++;
        const results = this.sorByCreatedAtDate(res.results);
        this.histories.push(lineSeparator(HubConnectionType.History));
        pushEntries(this.histories, results, 'id');
      }
      this.isLoading = false;
    }, (err) => {
      this.toastr.error(null, err);
      this.isLoading = false;
    });
  }

  load() {
    this.isLoading = true;
    const sidebarFilter = this.sideBarFilter ? ` and ${this.sideBarFilter}` : '';
    const searchKey = this.searchKeyFilter ? ` and ${this.searchKeyFilter}` : '';
    const searchPeopleId = this.peopleId ? ` and peopleId ${this.peopleId}` : '';
    this.historyService.getHistories(`${sidebarFilter}${searchKey}${searchPeopleId}`, this.currentPage).subscribe((res) => {
      this.histories = res.results;
      if (this.initialLoadingForNoDataModal) {
        if (!this.histories.length) {
          this.showNoDataModal = true;
        }
        this.initialLoadingForNoDataModal = false;
      }
      this.isShowLoadMoreHistory = res.results.length;
      this.totalCount = res.count;
      this.newActivityCount = 0;
      this.isLoading = false;
    }, (err) => {
      this.toastr.error(null, err);
      this.isLoading = false;
    });
  }

  sorByCreatedAtDate(data: Array<any>) {
    const sorted = data.sort((val1, val2) => {
      return new Date(val2.createdAt).getTime() - new Date(val1.createdAt).getTime();
    });
    return sorted;
  }

  showSideBar(): void {
    this.showNoDataModal = false;
    this.sidebarWindowRef.sidebarOpened();
  }

  changeFilterClearAll(e): void {
    if (e) {
      // this.searchKeyFilter = null;
      this.searchKeyFilter = null;
      this.filterRef.clickResetBtn();
      // this.search$.next();
    }
  }

  changeFilterSearchPressKey(e): void {
    this.searchKeyFilter = e;
  }

  filterChanged(sidebarFilter, searchKeyFilter): void {
    this.sideBarFilter = sidebarFilter;
    this.searchKeyFilter = searchKeyFilter;
    this.search$.next();
  }

  changeSearchKeyFilter(filters): void {
    this.searchKeyFilter = filters;
    if (filters !== '') {
      this.filterChanged(this.sideBarFilter, this.searchKeyFilter);
    }
  }

  changeCustomFilter(e): void {
    this.isCustomDate = false;
    this.startDate = e.date.start;
    this.endDate = e.date.end;
    this.date.start = e.date.start;
    this.date.end = e.date.end;
    // this.typeDateRange = e.typeDateRange;
  }

  customFilterSelected(e): void {
    this.isCustomDate = true;
    this.customDate.start = e.start;
    this.customDate.end = e.end;
  }

  changeFilter(filters): void {
    this.sideBarFilter = filters;
    if (this.initialLoading) {
      //  this.sideBarFilter = filters;
      // this.search$.next();
      setTimeout(() => {
        this.filterRef.clickSearchBtn();
      }, 200);
      if (this.mapRef) {
        this.mapRef.filterChanged(this.sideBarFilter, this.searchKeyFilter);
      }
      this.initialLoading = false;
    }
  }

  changeFilterBtn(filters): void {
    this.currentPageLoadMore = 2;
    this.sideBarFilter = filters;
    if (this.currentView === View.ListView) {
      this.search$.next();
    }
    if (this.mapRef) {
      this.mapRef.filterChanged(this.sideBarFilter, this.searchKeyFilter);
    }
  }
  changeFilterPeopleId(e) {
   // this.peopleId = e;
  }

  toggleCurrentView(view: View): void {
    this.currentView = view;
    this.newActivityCount = 0;
    if (this.currentView === View.ListView) {
      this.currentViewReports = null;
      this.currentPage = 1;
      this.search$.next();
    } else if (this.currentView === View.MapView) {
      this.currentViewReports = null;
    } else if (this.currentView === View.ReportsView) {
      this.currentViewReports = null;
      this.showNoDataModal = false;
      setTimeout(() => {
     //   this.activityReports.applyFilterNext();
      }, 300);
    }
  }

  pageChanged(e: PageChangedEvent): void {
    const startItem = (e.page - 1) * e.itemsPerPage;
    const endItem = e.page * e.itemsPerPage;
    this.currentPage = e.page;
    this.historiesThroughPagination = this.histories.slice(startItem, endItem);
    // this.search$.next();
  }

  openImage(src): void {
    if (src) {
      this.sidebarWindowRef.openImageModal(src);
    }
  }

  openDetail(data): void {
    this.sidebarWindowRef.openDetailModal(data);
  }

  closeSidebar(e): void {
    if (e) {
      this.sidebarWindowRef.closeSidebar();
    }
  }

  toggleOverlaySidebar(e): void {
    if (e) {
      this.showNoDataModal = false;
    }
  }

  newActivityArrived(): void {
    // this.totalCount += 1;
    this.showNoDataModal = false;
    this.newActivityCount += 1;
  }

  viewNewItems(): void {
    if (this.currentView === View.MapView) {
      this.toggleCurrentView(View.ListView);
    } else {
      this.newActivityCount = 0;
      if (this.tableRef) {
        this.tableRef.displayNewActivities();
      }
    }
  }

  private handleTriggeredEvent(e): void {
    if (e.message === EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER) {
      this.searchKeyFilterRef.search(e.data.identifier);
    } else if (e.data.eventId) {
      this.sideBarFilter = `id eq ${e.data.eventId}`;
    } else {
      this.sideBarFilter = `id eq ${e.data.id}`;
    }
    this.search$.next();
  }
}
