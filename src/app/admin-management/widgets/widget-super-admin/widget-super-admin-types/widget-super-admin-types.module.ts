import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { WidgetSuperAdminTypesComponent } from './widget-super-admin-types.component';
import { WidgetSuperAdminTypesAddComponent } from './widget-super-admin-types-add/widget-super-admin-types-add.component';
import { WidgetSuperAdminIdentifierTypeAddComponent } from './widget-super-admin-identifier-type-add/widget-super-admin-identifier-type-add.component';
import { WidgetSuperAdminActionReasonsAddComponent } from './widget-super-admin-types-add/widget-super-admin-action-reasons-add/widget-super-admin-action-reasons-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminTypesComponent
  ],
  declarations: [
    WidgetSuperAdminTypesComponent,
    WidgetSuperAdminTypesAddComponent,
    WidgetSuperAdminIdentifierTypeAddComponent,
    WidgetSuperAdminActionReasonsAddComponent
  ],
  entryComponents: [
    WidgetSuperAdminTypesComponent
  ]
})
export class WidgetSuperAdminTypesModule {
}
