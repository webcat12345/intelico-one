import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { WidgetSettingsComponent } from './widget-settings.component';
import { WidgetSettingsThemeTabComponent } from './widget-settings-theme-tab/widget-settings-theme-tab.component';
import { WidgetSettingsProfileTabComponent } from './widget-settings-profile-tab/widget-settings-profile-tab.component';
import { WidgetSettingsPasswordTabComponent } from './widget-settings-password-tab/widget-settings-password-tab.component';
import { WidgetSettingsUserSettingsTabComponent } from './widget-settings-user-settings-tab/widget-settings-user-settings-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  exports: [WidgetSettingsComponent],
  declarations: [
    WidgetSettingsComponent,
    WidgetSettingsThemeTabComponent,
    WidgetSettingsProfileTabComponent,
    WidgetSettingsPasswordTabComponent,
    WidgetSettingsUserSettingsTabComponent
  ],
  entryComponents: [
    WidgetSettingsComponent
  ]
})
export class WidgetSettingsModule {
}
