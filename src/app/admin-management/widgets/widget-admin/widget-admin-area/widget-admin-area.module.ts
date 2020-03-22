import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OneFilterModule } from '@one-common/filter';
import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneMapModule } from '@one-common/map';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneWindowModule } from '@one-common/window';
import { OneClusterMapModule } from '../../../../common/one-cluster-map/one-cluster-map.module';

import { WidgetAdminAreaComponent } from './widget-admin-area.component';
import { WidgetAdminAreaAddComponent } from './widget-admin-area-add/widget-admin-area-add.component';
import { WidgetAdminAreaFilterComponent } from './widget-admin-area-filter/widget-admin-area-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OneWindowModule,
    OneFilterModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgPipesModule,
    OneMapModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule,
    OneClusterMapModule
  ],
  exports: [
    WidgetAdminAreaComponent
  ],
  declarations: [
    WidgetAdminAreaComponent,
    WidgetAdminAreaAddComponent,
    WidgetAdminAreaFilterComponent
  ],
  entryComponents: [
    WidgetAdminAreaComponent
  ]
})
export class WidgetAdminAreaModule {
}
