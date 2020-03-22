import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { WidgetAdminCompanyModule } from './widget-admin-company/widget-admin-company.module';
import { WidgetAdminProductModule } from './widget-admin-product/widget-admin-product.module';
import { WidgetAdminWebhooksModule } from './widget-admin-webhooks/widget-admin-webhooks.module';
import { WidgetAdminPeopleModule } from './widget-admin-people/widget-admin-people.module';
import { WidgetAdminAreaModule } from './widget-admin-area/widget-admin-area.module';
import { WidgetAdminSiteModule } from './widget-admin-site/widget-admin-site.module';
import { WidgetAdminIdentifierModule } from './widget-admin-identifier/widget-admin-identifier.module';
import { WidgetAdminZoneModule } from './widget-admin-zone/widget-admin-zone.module';
import { WidgetAdminUserModule } from './widget-admin-user/widget-admin-user.module';
import { WidgetAdminAssetModule } from './widget-admin-asset/widget-admin-asset.module';
import { WidgetAdminTeamModule } from './widget-admin-team/widget-admin-team.module';
import { WidgetAdminActionModule } from './widget-admin-action/widget-admin-action.module';
import { WidgetAdminSourceModule } from './widget-admin-source/widget-admin-source.module';
import { WidgetAdminResolvedReasonModule } from './widget-admin-resolved-reason/widget-admin-resolved-reason.module';

import { WidgetAdminComponent } from './widget-admin.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    WidgetAdminCompanyModule,
    WidgetAdminProductModule,
    WidgetAdminWebhooksModule,
    WidgetAdminPeopleModule,
    WidgetAdminAreaModule,
    WidgetAdminSiteModule,
    WidgetAdminIdentifierModule,
    WidgetAdminZoneModule,
    WidgetAdminUserModule,
    WidgetAdminAssetModule,
    WidgetAdminTeamModule,
    WidgetAdminActionModule,
    WidgetAdminSourceModule,
    WidgetAdminResolvedReasonModule
  ],
  exports: [
    WidgetAdminComponent,
    WidgetAdminCompanyModule,
    WidgetAdminProductModule,
    WidgetAdminPeopleModule,
    WidgetAdminAreaModule,
    WidgetAdminSiteModule,
    WidgetAdminIdentifierModule,
    WidgetAdminZoneModule,
    WidgetAdminUserModule,
    WidgetAdminAssetModule,
    WidgetAdminTeamModule,
    WidgetAdminActionModule,
    WidgetAdminSourceModule,
    WidgetAdminResolvedReasonModule
  ],
  entryComponents: [
    WidgetAdminComponent
  ],
  declarations: [WidgetAdminComponent]
})
export class WidgetAdminModule {
}
