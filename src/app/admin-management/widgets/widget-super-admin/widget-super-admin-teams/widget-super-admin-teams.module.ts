import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminTeamsComponent } from './widget-super-admin-teams.component';
import { WidgetSuperAdminTeamsAddComponent } from './widget-super-admin-teams-add/widget-super-admin-teams-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminTeamsComponent
  ],
  entryComponents: [
    WidgetSuperAdminTeamsComponent
  ],
  declarations: [WidgetSuperAdminTeamsComponent, WidgetSuperAdminTeamsAddComponent]
})
export class WidgetSuperAdminTeamsModule {
}
