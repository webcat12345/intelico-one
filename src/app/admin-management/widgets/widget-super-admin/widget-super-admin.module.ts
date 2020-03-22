import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetSuperAdminTagsModule } from './widget-super-admin-tags/widget-super-admin-tags.module';
import { WidgetSuperAdminTeamsModule } from './widget-super-admin-teams/widget-super-admin-teams.module';
import { WidgetSuperAdminUsersModule } from './widget-super-admin-users/widget-super-admin-users.module';
import { WidgetSuperAdminOrganisationsModule } from './widget-super-admin-organisations/widget-super-admin-organisations.module';
import { WidgetSuperAdminInputAgentsModule } from './widget-super-admin-input-agents/widget-super-admin-input-agents.module';
import { WidgetSuperAdminOutputAgentsModule } from './widget-super-admin-output-agents/widget-super-admin-output-agents.module';
import { WidgetSuperAdminAlertLevelModule } from './widget-super-admin-alert-level/widget-super-admin-alert-level.module';
import { WidgetSuperAdminUserRolesModule } from './widget-super-admin-user-roles/widget-super-admin-user-roles.module';
import { WidgetSuperAdminTypesModule } from './widget-super-admin-types/widget-super-admin-types.module';
import { WidgetSuperAdminGlobalStatsModule } from './widget-super-admin-global-stats/widget-super-admin-global-stats.module';
import { WidgetSuperAdminAlertTemplateModule } from './widget-super-admin-alert-template/widget-super-admin-alert-template.module';
import { WidgetSuperAdminModulesModule } from './widget-super-admin-modules/widget-super-admin-modules.module';
import { WidgetSuperAdminSystemSettingsModule } from './widget-super-admin-gdpr/widget-super-admin-system-settings.module';
import { WidgetSuperAdminChangeLogModule } from './widget-super-admin-change-log/widget-super-admin-change-log.module';

import { WidgetSuperAdminComponent } from './widget-super-admin.component';

@NgModule({
  imports: [
    CommonModule,
    WidgetSuperAdminTagsModule,
    WidgetSuperAdminTeamsModule,
    WidgetSuperAdminUsersModule,
    WidgetSuperAdminModulesModule,
    WidgetSuperAdminOrganisationsModule,
    WidgetSuperAdminInputAgentsModule,
    WidgetSuperAdminOutputAgentsModule,
    WidgetSuperAdminAlertLevelModule,
    WidgetSuperAdminUserRolesModule,
    WidgetSuperAdminTypesModule,
    WidgetSuperAdminChangeLogModule,
    WidgetSuperAdminGlobalStatsModule,
    WidgetSuperAdminAlertTemplateModule,
    WidgetSuperAdminSystemSettingsModule
  ],
  exports: [
    WidgetSuperAdminComponent,
    WidgetSuperAdminTagsModule,
    WidgetSuperAdminTeamsModule,
    WidgetSuperAdminUsersModule,
    WidgetSuperAdminModulesModule,
    WidgetSuperAdminOrganisationsModule,
    WidgetSuperAdminInputAgentsModule,
    WidgetSuperAdminOutputAgentsModule,
    WidgetSuperAdminAlertLevelModule,
    WidgetSuperAdminUserRolesModule,
    WidgetSuperAdminTypesModule,
    WidgetSuperAdminChangeLogModule,
    WidgetSuperAdminGlobalStatsModule,
    WidgetSuperAdminAlertTemplateModule,
    WidgetSuperAdminSystemSettingsModule
  ],
  declarations: [WidgetSuperAdminComponent],
  entryComponents: [
    WidgetSuperAdminComponent
  ]
})
export class WidgetSuperAdminModule {
}
