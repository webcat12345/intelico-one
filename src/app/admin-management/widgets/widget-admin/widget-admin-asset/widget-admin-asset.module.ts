import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';

import { WidgetAdminAssetComponent } from './widget-admin-asset.component';
import { WidgetAdminAssetAddComponent } from './widget-admin-asset-add/widget-admin-asset-add.component';

@NgModule({
  imports: [
    CommonModule,
    FrozenHeaderTableModule,
    OneDirectiveModule
  ],
  exports: [
    WidgetAdminAssetComponent
  ],
  entryComponents: [
    WidgetAdminAssetComponent
  ],
  declarations: [WidgetAdminAssetComponent, WidgetAdminAssetAddComponent]
})
export class WidgetAdminAssetModule {
}
