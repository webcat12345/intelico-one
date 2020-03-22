import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { Angular2CsvModule } from 'angular2-csv';
import { NgSelectModule } from '@ng-select/ng-select';

import { OneMapModule } from '@one-common/map';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { ZoneSelectorModule } from '@one-common/ui-kit/zone-selector/zone-selector.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { OneClusterMapModule } from '../../../../common/one-cluster-map/one-cluster-map.module';

import { WidgetAdminSourceComponent } from './widget-admin-source.component';
import { WidgetAdminSourceAddComponent } from './widget-admin-source-add/widget-admin-source-add.component';
import { WidgetAdminSourceLocationMapComponent } from './widget-admin-source-location-map/widget-admin-source-location-map.component';
import { WidgetAdminSourceFilterComponent } from './widget-admin-source-filter/widget-admin-source-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OneFilterModule,
    OneMapModule,
    OneClusterMapModule,
    OneWindowModule,
    ReactiveFormsModule,
    NgPipesModule,
    Angular2CsvModule,
    NgSelectModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule,
    TooltipModule.forRoot(),
    ZoneSelectorModule
  ],
  exports: [
    WidgetAdminSourceComponent,
    WidgetAdminSourceAddComponent,
    WidgetAdminSourceFilterComponent,
    WidgetAdminSourceLocationMapComponent
  ],
  entryComponents: [WidgetAdminSourceComponent],
  declarations: [
    WidgetAdminSourceComponent,
    WidgetAdminSourceAddComponent,
    WidgetAdminSourceFilterComponent,
    WidgetAdminSourceLocationMapComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WidgetAdminSourceModule {
}
