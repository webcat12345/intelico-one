import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgPipesModule } from 'ngx-pipes';

import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminGlobalStatsComponent } from './widget-super-admin-global-stats.component';
import { WidgetSuperAdminGlobalStatsFilterComponent } from './widget-super-admin-global-stats-filter/widget-super-admin-global-stats-filter.component';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    OneWindowModule,
    OneFilterModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminGlobalStatsComponent
  ],
  declarations: [WidgetSuperAdminGlobalStatsComponent, WidgetSuperAdminGlobalStatsFilterComponent],
  entryComponents: [
    WidgetSuperAdminGlobalStatsComponent
  ]
})
export class WidgetSuperAdminGlobalStatsModule {
}
