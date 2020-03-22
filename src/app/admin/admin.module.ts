import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotkeyModule } from 'angular2-hotkeys';
import { ContextMenuModule } from 'ngx-contextmenu';

import { AdminRoutingModule } from './admin-routing.module';
import { OneDirectiveModule } from '@one-common/directive';
import { OneNotificationsModule } from '@one-common/notifications';

import { AdminManagementModule } from '../admin-management/admin-management.module';
import { WidgetSettingsModule } from '../admin-management/widgets/widget-settings/widget-settings.module';

import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminManagementModule,
    OneNotificationsModule,
    HotkeyModule,
    ContextMenuModule,
    WidgetSettingsModule,
    OneDirectiveModule
  ],
  exports: [],
  declarations: [AdminComponent]
})
export class AdminModule {
}
