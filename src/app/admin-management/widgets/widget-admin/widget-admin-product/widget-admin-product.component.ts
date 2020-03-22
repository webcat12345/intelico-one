import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { WindowName } from '../../../meta/admin-meta';
import { flyIn } from '@one-animation/flyIn.animation';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { AdminManagementService } from '../../../services/admin-management.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { IProduct, IProductList, ProductService } from '@one-core/service/product.service';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';

@Component({
  selector: 'one-admin-widget-admin-product',
  templateUrl: './widget-admin-product.component.html',
  styleUrls: ['./widget-admin-product.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminProductComponent implements OnInit, OnDestroy {

  @ViewChild(SearchKeyFilterComponent, {static: true}) searchKeyFilterRef: SearchKeyFilterComponent;

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  showAddModal = false;
  showConfirmModal = false;
  isLoading = false;
  isAddModal = false;
  selectedProduct: IProduct = null;
  UserRole = UserRole;
  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '20%', isLink: false},
    {label: 'Description', name: 'description', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  searchKey = '';
  searchKeyFilter = '';
  searchKeyFilterBy: string;
  isSearchKeyFilter: boolean;
  productList: IProductList = {data: [], totalCount: 0};

  search$: Subject<any> = new Subject<any>();
  searchByIdentifier$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private productService: ProductService,
    private adminManagementService: AdminManagementService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getProducts())
    ).subscribe();
    this.searchByIdentifier$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => {
        // Todo
      })
    ).subscribe();
    this.adminManagementService.triggerEvent$.pipe(
      takeUntil(this.unsubscribeAll),
      filter(x => x.windowType === WindowName.AdminProduct),
      tap(data => this.handleTriggeredEvent(data.data))
    ).subscribe();

    this.showAddModal = this.isAddWindow;
    setTimeout(() => {
      if (!this.isSearchKeyFilter) {
        this.getProducts();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.isAddModal = true;
    this.selectedProduct = null;
  }

  changeSearchKeyFilter(filters) {
    this.searchKeyFilter = filters;
    if (this.searchKeyFilter) {
      this.searchByIdentifier$.next();
    } else {
      this.search$.next();
    }
  }

  getProducts() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.productList = {
        data: [
          {id: 1, name: '[static] Apple', description: '[static] Apple description'},
          {id: 2, name: '[static] Orange', description: '[static] Orange description'},
        ], totalCount: 2
      };
    }, 1000);
  }

  onRemoveProduct(e) {
    this.showConfirmModal = true;
    this.selectedProduct = e;
  }

  onEditProduct(e): void {
    this.isAddModal = false;
    this.selectedProduct = e;
    this.showAddModal = true;
  }

  onDelete(flag) {
    if (flag) {
      this.selectedProduct = null;
      this.showConfirmModal = false;
      this.getProducts();
      this.toastr.success('Product deleted');
    } else {
      this.selectedProduct = null;
      this.showConfirmModal = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getProducts();
    }
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

  private handleTriggeredEvent(e) {
  }

}
