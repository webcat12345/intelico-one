import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProductService } from '@one-core/service/product.service';
import { CreateRemoveProducts, IPeople, PeopleService } from '@one-core/service/people.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminPeopleStateService } from '../../services/widget-admin-people-state.service';
import { ToastrService } from '../../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-people-products-detail',
  templateUrl: './widget-admin-people-products-detail.component.html',
  styleUrls: ['./widget-admin-people-products-detail.component.scss']
})
export class WidgetAdminPeopleProductsDetailComponent implements OnInit {

  @Input() person: IPeople;
  @Input() isNew: boolean;
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() closeAddModal: EventEmitter<boolean> = new EventEmitter();

  productNames: Array<any> = [];
  addDuplicateProductNames: Array<any> = [];
  deleteDuplicateProductNames: Array<any> = [];
  updateProductIds: Array<string> = [];
  selectedProductName = '';
  editProducts: CreateRemoveProducts = {removeProducts: [], newProducts: []};
  selectedProductNameId: string;
  showConfirmModal: boolean;

  info: Array<TableInfo> = [
    {label: '', name: 'productName', width: '', isLink: false},
    {label: '', name: 'action_group', width: '70px', isLink: false},
  ];

  data: Array<any> = [];
  selectProductName: FormGroup = this.fb.group({
    product_name: ['']
  });

  constructor(
    public widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
    private productService: ProductService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.selectProductName.controls.product_name.setValue('default');
    this.selectProductName.get('product_name').valueChanges.subscribe((productName) => {
      if (productName) {
        this.selectedProductName = productName;
      }
    });

    const products = {
      data: [
        {id: 1, name: '[static] Apple', description: '[static] Apple description'},
        {id: 2, name: '[static] Orange', description: '[static] Orange description'},
      ], totalCount: 2
    };

    if (products.data.length > 0) {
      products.data.map((item, index) => {
        this.productNames.push({id: item.id, value: item.name});
        this.addDuplicateProductNames.push({id: item.id, value: item.name});
        this.deleteDuplicateProductNames.push({id: item.id, value: item.name});
      });
    }
    if (this.isNew) {
      if (this.person.peopleProductAssociates && this.person.peopleProductAssociates.length > 0) {
        this.productNames.map((item, index) => {
          this.person.peopleProductAssociates.map((itm) => {
            if (item.id === itm.productId) {
              this.addDuplicateProductNames.splice(index, 1);
              this.addDuplicateProductNames.splice(index, 0, {id: 1, value: ''});
              this.data.push({id: item.id, productName: item.value});
            }
          });
        });
      }
      this.productNames = this.addDuplicateProductNames;
    }
    if (!this.isNew) {
      if (this.person.products.newProducts.length > 0) {
        this.productNames.map((item) => {
          this.person.products.newProducts.map((itm, index) => {
            if (item.id === itm) {
              this.data.push({id: item.id, productName: item.value});
              this.productNames.splice(index, 1);
              this.productNames.splice(index, 0, {id: 1, value: ''});
            }
          });
        });
      }
    }
  }

  onRemove(e): void {
    this.selectedProductNameId = e.id;
    this.showConfirmModal = true;
  }

  onDelete(e): void {
    if (e) {
      this.data.map((item, index) => {
        if (this.selectedProductNameId === item.id) {
          this.data.splice(index, 1);
        }
      });
      if (!this.isNew) {
        this.person.products.newProducts.map((item, index) => {
          if (this.selectedProductNameId === item) {
            this.person.products.newProducts.splice(index, 1);
          }
        });
      }
      this.deleteDuplicateProductNames.map((item, index) => {
        if (this.selectedProductNameId === item.id) {
          this.addDuplicateProductNames.splice(index, 1);
          this.productNames.splice(index, 0, item);
          this.editProducts.removeProducts.push(item.id);
        }
      });
      this.showConfirmModal = false;
      this.selectedProductName = '';
    } else {
      this.showConfirmModal = false;
    }
  }

  addProductName(): void {
    this.productNames.map((item, index) => {
      if (item.value === this.selectedProductName) {
        if (!this.isNew) {
          this.person.products.newProducts.push(item.id);
        }
        if (this.isNew) {
          this.editProducts.newProducts.push(item.id);
        }
        this.data.push({id: item.id, productName: this.selectedProductName});
        this.updateProductIds.push(item.id);
        this.addDuplicateProductNames.splice(index, 1);
        this.addDuplicateProductNames.splice(index, 0, {id: 1, value: ''});
        this.productNames = [];
        this.productNames = this.addDuplicateProductNames;
      }
    });
    this.selectedProductName = '';
    this.selectProductName.controls.product_name.setValue('default');
    this.widgetAdminPeopleStateService.updatePerson(this.person);
    if (this.isNew) {
      this.peopleService.setEditProducts(this.editProducts);
    }
  }

  nextStepPerson(): void {
    this.peopleService.setEditProducts(this.editProducts);
    this.widgetAdminPeopleStateService.updateCountSteps(5);
    this.nextStep.emit('compliance');
  }

  updateProducts() {
    if (this.person.id) {
      this.toastr.success('Successfully updated a product(s)');
      this.closeAddModal.emit(true);
    }
    this.closeAddModal.emit(true);
  }
}
