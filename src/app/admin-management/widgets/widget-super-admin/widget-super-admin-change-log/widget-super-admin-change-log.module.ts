import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgPipesModule } from 'ngx-pipes';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { WidgetSuperAdminChangeLogComponent } from './widget-super-admin-change-log.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminChangeLogComponent
  ],
  entryComponents: [
    WidgetSuperAdminChangeLogComponent
  ],
  declarations: [
    WidgetSuperAdminChangeLogComponent
  ]
})
export class WidgetSuperAdminChangeLogModule {
}
