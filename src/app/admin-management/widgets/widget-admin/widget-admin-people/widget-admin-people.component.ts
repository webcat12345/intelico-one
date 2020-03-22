import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject, Subscription } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { WindowName } from '../../../meta/admin-meta';
import { flyIn } from '@one-animation/flyIn.animation';
import { AddStep } from './widget-admin-people.enum';
import { EVENT_MESSAGE } from '../../../meta/admin-event-message';
import { UserRole } from '../../../../core/models/authentication';
import { View } from '../../widget-alerts/widget-alerts.component';
import { ToastrService } from '../../../services/toastr.service';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { AdminManagementService } from '../../../services/admin-management.service';
import { IPeople, IPeopleList, PeopleService } from '@one-core/service/people.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminPeopleStateService } from './services/widget-admin-people-state.service';
import { SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

@Component({
  selector: 'one-admin-widget-admin-people',
  templateUrl: './widget-admin-people.component.html',
  styleUrls: ['./widget-admin-people.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminPeopleComponent implements OnInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: true}) sidebarWindow: SidebarWindowComponent;
  @ViewChild(SearchKeyFilterComponent, {static: false}) searchKeyFilterRef: SearchKeyFilterComponent;

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  UserRole = UserRole;
  info: Array<TableInfo> = [
    {label: '', name: 'avatar', width: '100px', isLink: false},
    {label: 'FirsName', name: 'firstName', width: '15%', isLink: false},
    {label: 'LastName', name: 'lastName', width: '15%', isLink: false},
    {label: 'Type', name: 'typeName', width: '22%', isLink: false},
    {label: 'Companies', name: 'companies', width: '', isLink: true},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  people: IPeople = {
    id: '',
    firstName: '',
    lastName: '',
    email: null,
    identifiers: {newIdentifiers: [], removeIdentifiers: []},
    groups: {newGroups: [], removeGroups: []},
    products: {newProducts: [], removeProducts: []},
    tenantKey: '',
    TypeId: '1',
    metadata: {address: {city: '', country: '', line1: '', latitude: 51.5074, longitude: 0.1278, line2: '', postCode: '', county: '', addressPeople: ''}, postCode: '', birthday: new Date(), gender: {id: 152, name: ''}},
    peopleTypeId: 0,
    companies: 0,
    peopleSourceId: 0
  };
  center = {lat: 51.5074, lng: 0.1278};

  showAddModal = false;
  showMapModal = false;
  isHandleTriggeredEvent: boolean;
  showConfirmModal = false;
  enum_addStep = AddStep;
  currentStep = AddStep.Default;
  View = View;
  currentView: View = View.ListView;
  searchKeyFilter = '';
  addressUI: string;
  personIdentifier = '';
  searchKey = '&';
  newAlertCount = 0;
  isLoading = false;
  isAddModal = true;
  currentPage = 1;
  selectedPeople: IPeople = null;
  searchResult: IPeopleList = {data: [], totalCount: 0};
  peopleList: IPeopleList = {data: [], totalCount: 0};
  subscriptions: Subscription[] = [];

  search$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private peopleService: PeopleService,
    private adminService: AdminManagementService,
    private widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.showAddModal = this.isAddWindow;
    this.currentStep = this.showAddModal ? this.enum_addStep.Search : this.enum_addStep.Default;

    this.adminService.triggerEvent$.pipe(
      takeUntil(this.unsubscribeAll),
      filter(x => x.windowType === WindowName.People),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();

    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getPeople())
    ).subscribe();

    this.subscriptions.push(
      this.widgetAdminPeopleStateService.reloadGetPeople$.subscribe(
        reload => {
          if (reload) {
            this.getPeople();
          }
        }
      ));
    setTimeout(() => {
      if (!this.isHandleTriggeredEvent) {
        this.getPeople();
      }
    }, 1000);
    this.subscriptions.push(
      this.widgetAdminPeopleStateService.countSteps$.subscribe(
        countStep => {
          if (countStep === 1) {
            this.showMapModal = true;
            this.currentStep = this.enum_addStep.Detail;
          } else if (countStep === 2) {
            this.showMapModal = false;
            this.currentStep = this.enum_addStep.Identifiers;
          } else if (countStep === 3) {
            this.showMapModal = false;
            this.currentStep = this.enum_addStep.Groups;
          } else if (countStep === 4) {
            this.showMapModal = false;
            this.currentStep = this.enum_addStep.Products;
          } else if (countStep === 5) {
            this.showMapModal = false;
            this.currentStep = this.enum_addStep.Compliance;
          }
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
    this.widgetAdminPeopleStateService.updateCountSteps(null);
  }

  filterByFirstName(e): void {
    if (e === 'All') {
      this.searchKey = '&';
    } else {
      this.searchKey = e;
    }
  }

  changeFilterClearAll(e): void {
    if (e) {
      this.searchKeyFilter = null;
      this.searchKey = '&';
      this.search$.next();
    }
  }

  changeSearchKeyFilter(filters): void {
    this.searchKeyFilter = filters;
    if (filters === null) {
      this.searchKeyFilter = '';
      this.isHandleTriggeredEvent = null;
    }
    setTimeout(() => {
      if (!this.isHandleTriggeredEvent) {
        this.searchKey = '&';
        this.search$.next();
      }
    }, 1000);
  }

  changeSearchKeyFilterSidebar(filters): void {
    //  this.searchKeyFilter = filters;
    //  this.search$.next();
  }

  toggleView(view: View): void {
    this.currentView = view;
    this.newAlertCount = 0;
    if (this.currentView === View.ListView) {
      this.currentPage = 1;
      this.search$.next();
    }
  }

  pageChanged(e: PageChangedEvent): void {
    this.currentPage = e.page;
    this.search$.next();
  }

  async getPeople(): Promise<void> {
    try {
      this.isLoading = true;
      const searchKey = this.searchKeyFilter ? ` and (firstName eq '${this.searchKeyFilter}' or lastName eq '${this.searchKeyFilter}' or PeopleIdentifiers.Any(Identifier eq '${this.searchKeyFilter}'))` : '';
      this.peopleList = await this.peopleService.getPeople(searchKey).toPromise() as IPeopleList;
      if (this.peopleList.data.length > 0) {
        this.peopleList.data.map((item) => {
          const find = item.identifiers.find(itm => itm.identifierTypeId === 155);
          if (find) {
            this.addressUI = find.value;
          }
          /*  if (item.address.line1) {
              this.addressUI = item.address.line1;
            } else if (item.address.line2) {
              this.addressUI += ` , ${item.address.line2}` ;
            } else if (item.address.town) {
              this.addressUI += ` , ${item.address.town}` ;
            } else if (item.address.county) {
              this.addressUI += ` , ${item.address.county}` ;
            } else if (item.address.country) {
              this.addressUI += ` , ${item.address.country}` ;
            } else if (item.address.postCode) {
              this.addressUI += ` , ${item.address.postCode}` ;
            }*/
          item.addressUI = this.addressUI;
          this.addressUI = null;
        });
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async getPeopleByIdentifier(): Promise<void> {
    try {
      this.isLoading = true;
      const identifier = this.personIdentifier ? ` and id eq '${this.personIdentifier}'` : '';
      this.peopleList = await this.peopleService.getPeople(identifier).toPromise() as IPeopleList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  openAddModal(): void {
    this.widgetAdminPeopleStateService.setUpdateIdentifiers(false);
    this.widgetAdminPeopleStateService.setUpdateGroups(false);
    this.widgetAdminPeopleStateService.setUpdateProducts(false);
    this.isAddModal = false;
    this.showAddModal = true;
    this.currentStep = this.enum_addStep.Detail;
    this.widgetAdminPeopleStateService.updateCountSteps(1);
    this.widgetAdminPeopleStateService.updatePerson(this.people = {
      id: '', firstName: '', lastName: '', email: null, createdDate: '', modifiedDate: '',
      identifiers: {newIdentifiers: [], removeIdentifiers: []}, groups: {newGroups: [], removeGroups: []}, products: {newProducts: [], removeProducts: []},
      // tslint:disable-next-line
      tenantKey: '', TypeId: '1', metadata: {address: {town: '', country: '', line1: '', latitude: 51.5074, longitude: 0.1278, line2: '', postCode: '', county: '', addressPeople: ''}, postCode: '', birthday: new Date(), gender: {id: 152, name: ''}}, peopleTypeId: 0, companies: 0, peopleSourceId: 0
    });
  }

  nextStepPerson(e): void {
    if (e === 'identifier') {
      this.currentStep = this.enum_addStep.Identifiers;
    }
    if (e === 'groups') {
      this.currentStep = this.enum_addStep.Groups;
    }
    if (e === 'compliance') {
      this.currentStep = this.enum_addStep.Compliance;
    }
  }

  addressLookup(e): void {
    setTimeout(() => {
      this.center = {lat: e.data.latitude, lng: e.data.longitude};
    }, 1000);
  }

  closeAddSection(e): void {
    this.currentStep = this.enum_addStep.Default;
    this.getPeople();
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

  onCloseSearchPanel(e, nextPanel: AddStep): void {
    if (e.isNew) {
      this.isAddModal = true;
      this.currentStep = AddStep.Detail;
      this.selectedPeople = {
        id: 'newUser', firstName: e.res.firstName, lastName: e.res.lastName, TypeId: '1', email: '',
        tenantKey: '', identifiers: {newIdentifiers: [{value: '', typeId: ''}], removeIdentifiers: [1]},
        groups: {newGroups: [], removeGroups: []}, products: {newProducts: [], removeProducts: []},
        metadata: null, peopleTypeId: 0, companies: 0, peopleSourceId: 0
      };
    } else {
      this.isAddModal = false;
      this.searchResult = e.res;
      if (nextPanel === AddStep.SearchResult) {
        this.searchResult = e.res;
      } else if (nextPanel === AddStep.Detail) {
        this.selectedPeople = e.res;
      }
      this.currentStep = nextPanel;
    }
  }

  onClosePanel(): void {
    this.showAddModal = false;
    this.showMapModal = false;
    this.center = {lat: 51.5074, lng: 0.1278};
  }

  closeAddModal(e): void {
    if (e) {
      this.showAddModal = false;
      this.getPeople();
    }
  }

  confirmDelete(e): void {
    this.selectedPeople = e;
    this.sidebarWindow.deleteConfirm();
  }

  listPeopleLength(e): void {
    this.peopleList.totalCount = e;
  }

  onEditPerson(personData: any): void {
    this.widgetAdminPeopleStateService.setUpdateIdentifiers(false);
    this.widgetAdminPeopleStateService.setUpdateGroups(false);
    this.widgetAdminPeopleStateService.setUpdateProducts(false);
    this.peopleService.getPerson(personData.person.id)
      .subscribe(
        person => {
          this.openEditModal(person);
        }, err => console.error(err)
      );
    if (personData.type === 'main') {
      this.currentStep = this.enum_addStep.Detail;
      this.widgetAdminPeopleStateService.updateCountSteps(1);
    }
    if (personData.type === 'identifiers') {
      this.currentStep = this.enum_addStep.Identifiers;
      this.widgetAdminPeopleStateService.updateCountSteps(2);
      this.widgetAdminPeopleStateService.setUpdateIdentifiers(true);
    }
    if (personData.type === 'groups') {
      this.currentStep = this.enum_addStep.Groups;
      this.widgetAdminPeopleStateService.updateCountSteps(3);
      this.widgetAdminPeopleStateService.setUpdateGroups(true);
    }
    if (personData.type === 'products') {
      this.currentStep = this.enum_addStep.Products;
      this.widgetAdminPeopleStateService.updateCountSteps(4);
      this.widgetAdminPeopleStateService.setUpdateProducts(true);
    }
  }

  openEditModal(person: any): void {
    this.isAddModal = true;
    this.showAddModal = true;
    // this.widgetAdminPeopleStateService.updateCountSteps(1);
    this.widgetAdminPeopleStateService.updatePerson(person.item ? person.item : null);
  }

  onRemovePerson(person: IPeople): void {
    this.showConfirmModal = true;
    this.selectedPeople = person;
  }

  async onDelete(flag): Promise<void> {
    if (flag) {
      try {
        this.isLoading = true;
        await this.peopleService.removePeople(this.selectedPeople.id).toPromise();
        await this.getPeople();
      } catch (e) {
        this.toastr.error(null, e);
      } finally {
        this.showConfirmModal = false;
        this.isLoading = false;
      }
    } else {
      this.selectedPeople = null;
      this.showConfirmModal = false;
    }
  }

  private handleTriggeredEvent(e): void {
    if (e.message === EVENT_MESSAGE.HISTORY_FILTER_BY_SELECTED_IDENTIFIER) {
      if (e.data.peopleId) {
        this.isHandleTriggeredEvent = true;
        this.personIdentifier = e.data.peopleId;
        this.peopleService.getPeople('')
          .subscribe(
            resp => {
              if (resp.data.length > 0) {
                resp.data.map((item) => {
                  if (item.id === e.data.peopleId) {
                    this.searchKeyFilterRef.search(`${item.firstName} ${item.lastName}`);
                  }
                });
              }
            }, error => console.error(error)
          );
        // this.searchKeyFilterRef.search();
        this.getPeopleByIdentifier();
      } else {
        this.peopleList = {data: [], totalCount: 0};
        this.toastr.warning(`No associated action found for identifier: ${e.data.identifier}`);
      }
      //  this.searchKeyFilterRef.search(e.data.identifier);
    } else if (e.data.eventId) {
      // this.searchKeyFilter = `id eq ${e.data.eventId}`;
    } else {
      //  this.searchKeyFilter = `id eq ${e.data.id}`;
    }
    // this.search$.next();
  }
}
