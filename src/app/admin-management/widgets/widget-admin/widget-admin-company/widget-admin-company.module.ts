import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneFilterModule } from '@one-common/filter';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
// One - Components
import { WidgetAdminCompanyComponent } from './widget-admin-company.component';
import { WidgetAdminCompanyAddComponent } from './widget-admin-company-add/widget-admin-company-add.component';

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
    WidgetAdminCompanyComponent
  ],
  declarations: [WidgetAdminCompanyComponent, WidgetAdminCompanyAddComponent],
  entryComponents: [
    WidgetAdminCompanyComponent
  ]
})
export class WidgetAdminCompanyModule {
}
