import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';

import { WidgetAdminActionComponent } from './widget-admin-action.component';
import { WidgetAdminActionIdentifierTypeComponent } from './widget-admin-action-identifier-type/widget-admin-action-identifier-type.component';
import { WidgetAdminActionTypeComponent } from './widget-admin-action-type/widget-admin-action-type.component';
import { WidgetAdminActionSearchComponent } from './widget-admin-action-search/widget-admin-action-search.component';
import { WidgetAdminActionListComponent } from './widget-admin-action-list/widget-admin-action-list.component';
import { WidgetAdminActionAddComponent } from './widget-admin-action-add/widget-admin-action-add.component';

@NgModule({
  imports: [
    CommonModule,
    FrozenHeaderTableModule,
    OneDirectiveModule
  ],
  exports: [
    WidgetAdminActionComponent
  ],
  declarations: [
    WidgetAdminActionComponent,
    WidgetAdminActionIdentifierTypeComponent,
    WidgetAdminActionTypeComponent,
    WidgetAdminActionSearchComponent,
    WidgetAdminActionListComponent,
    WidgetAdminActionAddComponent
  ],
  entryComponents: [
    WidgetAdminActionComponent
  ]
})
export class WidgetAdminActionModule {
}
