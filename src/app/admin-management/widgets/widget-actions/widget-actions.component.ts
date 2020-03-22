import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { WindowName } from '../../meta/admin-meta';
import { ToastrService } from '../../services/toastr.service';
import { ActionService } from '@one-core/service/action.service';
import { debounceTime, delay, filter, takeUntil, tap } from 'rxjs/operators';
import { ActionStateService, ActionStep } from './services/action-state.service';
import { AdminManagementService } from '../../services/admin-management.service';
import { ActionSidebarComponent } from './action-sidebar/action-sidebar.component';
import { SidebarOption, SidebarType, SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

@Component({
  selector: 'one-admin-widget-actions',
  templateUrl: './widget-actions.component.html',
  styleUrls: ['./widget-actions.component.scss']
})
export class WidgetActionsComponent implements AfterViewInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: false}) sidebarWindow: SidebarWindowComponent;
  @ViewChild(ActionSidebarComponent, {static: false}) sidebarRef: ActionSidebarComponent;
  @ViewChild(SearchKeyFilterComponent, {static: false}) searchNavKeyFilter: SearchKeyFilterComponent;

  sidebarOption: SidebarOption = {type: SidebarType.HasOverlaySidebar, classes: 'actions-sidebar lg-width'};
  isLoading = false;
  filter = '';
  identifier: string;
  searchKeyFilter = '';
  search$: Subject<any> = new Subject<any>();
  actions: any[] = [];
  totalCount = 0;
  selectedAction: any = null;
  isTriggeredEvent: boolean;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public actionService: ActionService,
    private actionStateService: ActionStateService,
    private toastr: ToastrService,
    private adminService: AdminManagementService
  ) {
  }

  ngAfterViewInit() {
    this.adminService.triggerEvent$.pipe(filter(x => x.windowType === WindowName.Control)).pipe(
      takeUntil(this.unsubscribeAll),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();
    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.load())
    ).subscribe();
    this.actionStateService.closeSidebar$.pipe(
      takeUntil(this.unsubscribeAll),
      tap(() => this.sidebarWindow.openOverlaySidebar())
    ).subscribe();
    this.actionStateService.actionCreated$.pipe(
      takeUntil(this.unsubscribeAll),
      tap(e => {
        this.sidebarWindow.openOverlaySidebar();
        this.search$.next();
      })
    ).subscribe();
    setTimeout(() => {
      if (!this.isTriggeredEvent) {
        this.search$.next();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  changeFilter(filters): void {
    this.filter = filters;
    this.search$.next();
  }

  changeSearchKeyFilter(filters): void {
    this.searchKeyFilter = filters;
    this.search$.next();
  }

  changeFilterClearAll(e) {
    if (e) {
      this.searchKeyFilter = '';
      this.search$.next();
    }
  }

  addIdentifier(e): void {
    this.sidebarWindow.isOverlaySidebarOpened = true;
    this.actionStateService.action = e;
    this.sidebarRef.selectedAction = e;
    this.sidebarRef.step = ActionStep.IdentifierForm;
    this.sidebarRef.changeStep(ActionStep.IdentifierForm);
  }

  confirmDelete(e): void {
    this.selectedAction = e;
    this.sidebarWindow.deleteConfirm();
  }

  deleteAction(e): void {
    if (!e) {
      return;
    }
    this.isLoading = true;
    this.actionService.deleteAction(this.selectedAction.id).pipe(delay(6000))
      .subscribe(
        resp => {
          this.load();
          this.isLoading = false;
        }, error => {
          this.toastr.error(null, error);
          console.log(error);
          this.isLoading = false;
        });
  }

  editAction(e): void {
    this.actionStateService.action = e;
    this.actionStateService.isEditModal = true;
    this.sidebarWindow.isOverlaySidebarOpened = true;
    this.sidebarRef.changeStep(ActionStep.Splash);
  }

  openAddAction(): void {
    this.actionStateService.action = {
      type: 'vehicle', dates: [], identifiers: [], triggers: [], locations: [],
      metaData: {key: '', operator: '', value: ''},
      conditions: [{key: '', operator: '', value: '', type: ''}]};
    this.actionStateService.isEditModal = false;
    this.sidebarRef.changeStep(ActionStep.ActionName);
  }

  handleTriggeredEvent(e): void {
    if (e) {
      this.isTriggeredEvent = true;
    }
    this.filter = `id eq ${e.data.actionId}`;
    this.actions = [];
    this.totalCount = 0;
    this.search$.next();
    this.identifier = e.data.identifier;
  //  this.searchNavKeyFilter.search(e.data.identifier);
    const keyCode = {keyCode: 13};
  //  this.searchNavKeyFilter.keyDown(keyCode);
  }

  private load() {
    try {
      this.isLoading = true;
      const sidebarFilter = this.filter ? ` and ${this.filter}` : '';
      const searchKey = this.searchKeyFilter ? ` and ${this.searchKeyFilter}` : '';
      this.actionService.getActions(`${sidebarFilter}${searchKey}`).subscribe((res) => {
        this.isLoading = false;
        this.actions = res.results;
        this.typeAction();
        this.totalCount = res.count;
        if (!this.actions.length) {
          this.toastr.warning(`No associated action found for this ${this.identifier} identifier.`);
        }
      }, (err) => this.isLoading = false);
    } catch (e) {
      this.isLoading = false;
      this.toastr.warning(`No associated action found for this ${this.identifier} identifier.`, e);
    }
  }
  private typeAction() {
    this.actions.map(item => {
      item.typeAction = item.conditions === 'null' ? 'Identifier' : 'Metadata';
    });
  }
}
