import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrozenHeaderTableModule } from '../../../../common/one-kit/frozen-header-table/frozen-header-table.module';

import { WidgetSuperAdminTagsComponent } from './widget-super-admin-tags.component';
import { WidgetSuperAdminTagsAddComponent } from './widget-super-admin-tags-add/widget-super-admin-tags-add.component';

@NgModule({
  imports: [
    CommonModule,
    FrozenHeaderTableModule
  ],
  exports: [
    WidgetSuperAdminTagsComponent
  ],
  entryComponents: [
    WidgetSuperAdminTagsComponent
  ],
  declarations: [WidgetSuperAdminTagsComponent, WidgetSuperAdminTagsAddComponent]
})
export class WidgetSuperAdminTagsModule {
}
