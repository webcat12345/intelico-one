import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetMessageModule } from './widget-message/widget-message.module';
import { WidgetSettingsModule } from './widget-settings/widget-settings.module';
import { WidgetAdminModule } from './widget-admin/widget-admin.module';
import { WidgetSuperAdminModule } from './widget-super-admin/widget-super-admin.module';
import { WidgetLocateModule } from './widget-locate/widget-locate.module';
import { WidgetActivityModule } from './widget-activity/widget-activity.module';
import { WidgetNotesModule } from './widget-notes/widget-notes.module';
import { WidgetAlertsModule } from './widget-alerts/widget-alerts.module';
import { WidgetActionsModule } from './widget-actions/widget-actions.module';
import { WidgetViewerModule } from './widget-viewer/widget-viewer.module';
import { WidgetTimelineModule } from './widget-timeline/widget-timeline.module';
import { WidgetInsightModule } from './widget-insight/widget-insight.module';
import { WidgetHelpModule } from './widget-help/widget-help.module';
import { WidgetAssetsModule } from './widget-assets/widget-assets.module';

@NgModule({
  imports: [
    CommonModule,
    WidgetMessageModule,
    WidgetSettingsModule,
    WidgetAdminModule,
    WidgetSuperAdminModule,
    WidgetLocateModule,
    WidgetActivityModule,
    WidgetNotesModule,
    WidgetAlertsModule,
    WidgetAssetsModule,
    WidgetActionsModule,
    WidgetViewerModule,
    WidgetTimelineModule,
    WidgetInsightModule,
    WidgetHelpModule
  ],
  exports: [
    WidgetMessageModule,
    WidgetSettingsModule,
    WidgetAdminModule,
    WidgetSuperAdminModule,
    WidgetLocateModule,
    WidgetActivityModule,
    WidgetNotesModule,
    WidgetAlertsModule,
    WidgetActionsModule,
    WidgetViewerModule,
    WidgetTimelineModule,
    WidgetInsightModule,
    WidgetHelpModule
  ],
  declarations: []
})
export class WidgetsModule {
}
