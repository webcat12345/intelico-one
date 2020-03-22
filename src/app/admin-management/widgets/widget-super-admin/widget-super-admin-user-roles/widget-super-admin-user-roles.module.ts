import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { WidgetSuperAdminUserRolesComponent } from './widget-super-admin-user-roles.component';
import { WidgetSuperAdminUserRolesAddComponent } from './widget-super-admin-user-roles-add/widget-super-admin-user-roles-add.component';

@NgModule({
  imports: [
    CommonModule,
    FrozenHeaderTableModule
  ],
  exports: [
    WidgetSuperAdminUserRolesComponent
  ],
  declarations: [WidgetSuperAdminUserRolesComponent, WidgetSuperAdminUserRolesAddComponent],
  entryComponents: [
    WidgetSuperAdminUserRolesComponent
  ]
})
export class WidgetSuperAdminUserRolesModule {
}
