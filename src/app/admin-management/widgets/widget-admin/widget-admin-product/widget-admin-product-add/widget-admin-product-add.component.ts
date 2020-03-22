import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IProduct, ProductService } from '@one-core/service/product.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-product-add',
  templateUrl: './widget-admin-product-add.component.html',
  styleUrls: ['./widget-admin-product-add.component.scss']
})
export class WidgetAdminProductAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedProduct: IProduct;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  product: IProduct = {id: 0, tenantKey: '', description: '', name: ''};

  constructor(
    private toastr: ToastrService,
    private productService: ProductService
  ) {
  }

  ngOnInit() {
    if (this.selectedProduct) {
      if (this.selectedProduct.id) {
        this.product = JSON.parse(JSON.stringify(this.selectedProduct));
      }
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (this.isNew) {
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.success('Product created');
        this.close.emit({success: true, isNew: true});
      }, 1000);
    } else {
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.success('Product updated');
        this.close.emit({success: true, isNew: false, data: this.product});
      }, 1000);
    }
  }
}
