import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { NgSelectModule } from '@ng-select/ng-select';

import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';
import { WidgetAdminTeamComponent } from './widget-admin-team.component';
import { WidgetAdminTeamAddComponent } from './widget-admin-team-add/widget-admin-team-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    NgSelectModule,
    LoaderModule,
    FrozenHeaderTableModule,
    OneDirectiveModule
  ],
  exports: [
    WidgetAdminTeamComponent
  ],
  entryComponents: [
    WidgetAdminTeamComponent
  ],
  declarations: [WidgetAdminTeamComponent, WidgetAdminTeamAddComponent]
})
export class WidgetAdminTeamModule {
}
