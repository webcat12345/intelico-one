import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// One - Modules
import { NgPipesModule } from 'ngx-pipes';
import { OneMapModule } from '@one-common/map';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneClusterMapModule } from '../../../../common/one-cluster-map/one-cluster-map.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
// One - Components
import { WidgetAdminResolvedReasonComponent } from './widget-admin-resolved-reason.component';
import { WidgetAdminResolvedReasonAddComponent } from './widget-admin-resolved-reason-add/widget-admin-resolved-reason-add.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OneWindowModule,
    OneFilterModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgPipesModule,
    OneMapModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule,
    OneClusterMapModule
  ],
  exports: [
    WidgetAdminResolvedReasonComponent,
    WidgetAdminResolvedReasonAddComponent
  ],
  declarations: [
    WidgetAdminResolvedReasonComponent,
    WidgetAdminResolvedReasonAddComponent
  ],
  entryComponents: [
    WidgetAdminResolvedReasonComponent,
    WidgetAdminResolvedReasonAddComponent
  ]
})
export class WidgetAdminResolvedReasonModule {
}
