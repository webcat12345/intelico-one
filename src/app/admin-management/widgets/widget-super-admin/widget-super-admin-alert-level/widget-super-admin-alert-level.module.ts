import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminAlertLevelComponent } from './widget-super-admin-alert-level.component';
import { WidgetSuperAdminAlertLevelAddComponent } from './widget-super-admin-alert-level-add/widget-super-admin-alert-level-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminAlertLevelComponent
  ],
  declarations: [WidgetSuperAdminAlertLevelComponent, WidgetSuperAdminAlertLevelAddComponent],
  entryComponents: [
    WidgetSuperAdminAlertLevelComponent
  ]
})
export class WidgetSuperAdminAlertLevelModule {
}
