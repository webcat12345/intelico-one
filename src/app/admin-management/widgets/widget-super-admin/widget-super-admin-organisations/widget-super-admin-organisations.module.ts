import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetSuperAdminOrganisationsComponent } from './widget-super-admin-organisations.component';
import { WidgetSuperAdminOrganisationsAddComponent } from './widget-super-admin-organisations-add/widget-super-admin-organisations-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminOrganisationsComponent,
  ],
  declarations: [WidgetSuperAdminOrganisationsComponent, WidgetSuperAdminOrganisationsAddComponent],
  entryComponents: [
    WidgetSuperAdminOrganisationsComponent,
  ]
})
export class WidgetSuperAdminOrganisationsModule {
}
