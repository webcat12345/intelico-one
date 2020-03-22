import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';

import { WidgetSuperAdminOutputAgentsComponent } from './widget-super-admin-output-agents.component';
import { WidgetSuperAdminOutputAgentsAddComponent } from './widget-super-admin-output-agents-add/widget-super-admin-output-agents-add.component';

@NgModule({
  imports: [
    CommonModule,
    FrozenHeaderTableModule
  ],
  exports: [
    WidgetSuperAdminOutputAgentsComponent
  ],
  declarations: [WidgetSuperAdminOutputAgentsComponent, WidgetSuperAdminOutputAgentsAddComponent],
  entryComponents: [
    WidgetSuperAdminOutputAgentsComponent
  ]
})
export class WidgetSuperAdminOutputAgentsModule {
}
