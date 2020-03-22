import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneWindowModule } from '@one-common/window';
import { OneDirectiveModule } from '@one-common/directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { WidgetSuperAdminModulesComponent } from './widget-super-admin-modules.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OneDirectiveModule,
    OneWindowModule,
    TooltipModule.forRoot(),
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetSuperAdminModulesComponent,
  ],
  declarations: [
    WidgetSuperAdminModulesComponent,
    WidgetSuperAdminModulesComponent],
  entryComponents: [
    WidgetSuperAdminModulesComponent,
  ]
})
export class WidgetSuperAdminModulesModule {
}
