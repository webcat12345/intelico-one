import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminInputAgentsComponent } from './widget-super-admin-input-agents.component';
import { WidgetSuperAdminInputAgentsAddComponent } from './widget-super-admin-input-agents-add/widget-super-admin-input-agents-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminInputAgentsComponent
  ],
  declarations: [WidgetSuperAdminInputAgentsComponent, WidgetSuperAdminInputAgentsAddComponent],
  entryComponents: [
    WidgetSuperAdminInputAgentsComponent
  ]
})
export class WidgetSuperAdminInputAgentsModule {
}
