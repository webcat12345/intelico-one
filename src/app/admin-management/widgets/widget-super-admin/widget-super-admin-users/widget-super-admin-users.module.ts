import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminUsersComponent } from './widget-super-admin-users.component';
import { WidgetSuperAdminUsersAddComponent } from './widget-super-admin-users-add/widget-super-admin-users-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminUsersComponent
  ],
  declarations: [WidgetSuperAdminUsersComponent, WidgetSuperAdminUsersAddComponent],
  entryComponents: [
    WidgetSuperAdminUsersComponent
  ]
})
export class WidgetSuperAdminUsersModule {
}
