import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';

import { WidgetAdminWebhooksComponent } from './widget-admin-webhooks.component';
import { WidgetAdminWebhooksAddComponent } from './widget-admin-webhooks-add/widget-admin-webhooks-add.component';
import { WidgetAdminWebhooksAddSuperAdminComponent } from './widget-admin-webhooks-add-super-admin/widget-admin-webhooks-add-super-admin.component';
import { WidgetAdminWebhooksPreviewSuperAdminComponent } from './widget-admin-webhooks-preview-super-admin/widget-admin-webhooks-preview-super-admin.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    NgPipesModule,
    FrozenHeaderTableModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminWebhooksComponent
  ],
  declarations:
    [WidgetAdminWebhooksComponent,
      WidgetAdminWebhooksAddComponent,
      WidgetAdminWebhooksAddSuperAdminComponent,
      WidgetAdminWebhooksPreviewSuperAdminComponent
    ],
  entryComponents: [
    WidgetAdminWebhooksComponent
  ], schemas: [NO_ERRORS_SCHEMA]
})
export class WidgetAdminWebhooksModule {
}
