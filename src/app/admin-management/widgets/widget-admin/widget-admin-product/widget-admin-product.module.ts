import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneFilterModule } from '@one-common/filter';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';

import { WidgetAdminProductComponent } from './widget-admin-product.component';
import { WidgetAdminProductAddComponent } from './widget-admin-product-add/widget-admin-product-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    TooltipModule.forRoot(),
    FrozenHeaderTableModule,
    OneDirectiveModule,
    OneFilterModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminProductComponent
  ],
  declarations: [WidgetAdminProductComponent, WidgetAdminProductAddComponent],
  entryComponents: [
    WidgetAdminProductComponent
  ]
})
export class WidgetAdminProductModule {
}
