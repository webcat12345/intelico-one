import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { WindowName } from '../../../meta/admin-meta';
import { flyIn } from '@one-animation/flyIn.animation';
import { IPeople } from '@one-core/service/people.service';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { EVENT_MESSAGE } from '../../../meta/admin-event-message';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';
import { AdminManagementService } from '../../../services/admin-management.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { CompanyService, ICompany, ICompanyList } from '@one-core/service/company.service';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

@Component({
  selector: 'one-admin-widget-admin-company',
  templateUrl: './widget-admin-company.component.html',
  styleUrls: ['./widget-admin-company.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminCompanyComponent implements OnInit, OnDestroy {

  @ViewChild(SearchKeyFilterComponent, {static: true}) searchKeyFilterRef: SearchKeyFilterComponent;

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  center = {lat: 51.5074, lng: 0.1278};
  showAddModal = false;
  showConfirmModal = false;
  isLoading = false;
  isAddModal = false;
  selectedCompany: ICompany = null;
  UserRole = UserRole;
  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '20%', isLink: false},
    {label: 'Description', name: 'address', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  searchKey = '';
  searchKeyFilter = '';
  searchKeyFilterBy: string;
  isSearchKeyFilter: boolean;
  companyList: ICompanyList = {data: [], totalCount: 0};
  companyTypes: IType[] = [];

  search$: Subject<any> = new Subject<any>();
  searchByIdentifier$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private companyService: CompanyService,
    private typesService: TypesService,
    private adminManagementService: AdminManagementService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getCompanies())
    ).subscribe();
    this.searchByIdentifier$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getCompaniesByIdentifier())
    ).subscribe();
    this.adminManagementService.triggerEvent$.pipe(
      takeUntil(this.unsubscribeAll),
      filter(x => x.windowType === WindowName.AdminGroups),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();

    this.showAddModal = this.isAddWindow;
    setTimeout(() => {
      if (!this.isSearchKeyFilter) {
        this.getCompanies();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openAddModal(person: IPeople): void {
    this.showAddModal = true;
    this.isAddModal = true;
    this.selectedCompany = null;
  }

  changeSearchKeyFilter(filters) {
    this.searchKeyFilter = filters;
    if (this.searchKeyFilter) {
      this.searchByIdentifier$.next();
    } else {
      this.search$.next();
    }
  }

  async getCompaniesByIdentifier() {
    this.isLoading = true;
    try {
      const searchKeyFilter = this.searchKeyFilter ? `${this.searchKeyFilter}` : '';
      const companyList = await this.companyService.getCompaniesByIdentifier(searchKeyFilter).toPromise() as ICompanyList;
      if (companyList.data.length > 0) {
        companyList.data.map((item) => {
          item.name = item.group.name;
          item.address = item.group.address;
        });
        const companyListDataLength = companyList.data.length;
        companyList.data.map((item, index) => {
          if (index === 0) {
            this.searchKeyFilterBy = ` and (id eq '${item.groupId}'`;
          }
          if (index !== 0 && index !== companyListDataLength - 1) {
            this.searchKeyFilterBy += ` or id eq '${item.groupId}'`;
          }
          if (index === companyListDataLength - 1) {
            this.searchKeyFilterBy += ` or id eq '${item.groupId}')`;
          }
        });
        //  this.companyList = await this.companyService.getCompanies(this.searchKeyFilterBy).toPromise() as ICompanyList;
        this.companyList = companyList;
      }
      if (companyList.data.length === 0) {
        this.toastr.warning(`For this ${this.searchKeyFilter} (identifier), no data was found`);
      }

    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async getCompanies() {
    this.isLoading = true;
    try {
      this.companyList = await this.companyService.getCompanies('').toPromise() as ICompanyList;
      const res = await this.typesService.getTypes(TypeCategory.Group).toPromise() as any;
      this.companyTypes = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateNewCompany(): void {
    this.isAddModal = true;
    this.selectedCompany = null;
    this.showAddModal = true;
  }

  onRemoveCompany(e) {
    this.showConfirmModal = true;
    this.selectedCompany = e;
  }

  onEditCompany(e): void {
    this.isAddModal = false;
    this.selectedCompany = e;
    this.showAddModal = true;
  }

  async onDelete(flag) {
    if (flag) {
      try {
        this.isLoading = true;
        await this.companyService.removeCompany(this.selectedCompany.id).toPromise();
        await this.getCompanies();
        this.selectedCompany = null;
        this.showConfirmModal = false;
        this.toastr.success('Company deleted');
      } catch (e) {
        this.toastr.error(null, e);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.selectedCompany = null;
      this.showConfirmModal = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getCompanies();
    }
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

  placeChanged(e): void {
    this.center = e.center;
    this.cdr.detectChanges();
  }

  private handleTriggeredEvent(e) {
    if (e.message === EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER) {
      this.searchKeyFilter = e.data.identifier;
      this.isSearchKeyFilter = true;
      this.getCompaniesByIdentifier();
      this.searchKeyFilterRef.search(e.data.identifier);
    } else if (e.data.eventId) {
      //  this.sideBarFilter = `id eq ${e.data.eventId}`;
    } else {
      //  this.sideBarFilter = `id eq ${e.data.id}`;
    }
    //  this.search$.next();
  }

}
