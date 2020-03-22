import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetAdminUserComponent } from './widget-admin-user.component';
import { WidgetAdminUserAddComponent } from './widget-admin-user-add/widget-admin-user-add.component';
import { WidgetAdminUserSearchResultComponent } from './widget-admin-user-search-result/widget-admin-user-search-result.component';
import { WidgetAdminUserInvitationComponent } from './widget-admin-user-invitation/widget-admin-user-invitation.component';
import { WidgetAdminUserEditComponent } from './widget-admin-user-edit/widget-admin-user-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminUserComponent
  ],
  declarations: [
    WidgetAdminUserComponent,
    WidgetAdminUserAddComponent,
    WidgetAdminUserSearchResultComponent,
    WidgetAdminUserInvitationComponent,
    WidgetAdminUserEditComponent
  ],
  entryComponents: [
    WidgetAdminUserComponent
  ]
})
export class WidgetAdminUserModule {
}
