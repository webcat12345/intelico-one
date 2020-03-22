import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OneFilterModule } from '@one-common/filter';
import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';
import { OneMapModule } from '@one-common/map';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneWindowModule } from '@one-common/window';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneClusterMapModule } from '../../../../common/one-cluster-map/one-cluster-map.module';

import { WidgetAdminZoneComponent } from './widget-admin-zone.component';
import { WidgetAdminZoneAddComponent } from './widget-admin-zone-add/widget-admin-zone-add.component';
import { WidgetAdminZoneLocationMapComponent } from './widget-admin-zone-location-map/widget-admin-zone-location-map.component';
import { WidgetAdminZoneFilterComponent } from './widget-admin-zone-filter/widget-admin-zone-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OneWindowModule,
    OneFilterModule,
    OneClusterMapModule,
    ReactiveFormsModule,
    NgPipesModule,
    OneMapModule,
    TooltipModule.forRoot(),
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminZoneComponent
  ],
  declarations: [
    WidgetAdminZoneComponent,
    WidgetAdminZoneAddComponent,
    WidgetAdminZoneFilterComponent,
    WidgetAdminZoneLocationMapComponent
  ],
  entryComponents: [
    WidgetAdminZoneComponent
  ]
})
export class WidgetAdminZoneModule {
}
