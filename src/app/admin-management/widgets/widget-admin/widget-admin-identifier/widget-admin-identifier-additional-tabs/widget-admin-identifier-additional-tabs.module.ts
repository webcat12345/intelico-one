import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetAdminIdentifierNumberplateTabComponent } from './widget-admin-identifier-numberplate-tab/widget-admin-identifier-numberplate-tab.component';
import { WidgetAdminIdentifierMacAddressTabComponent } from './widget-admin-identifier-mac-address-tab/widget-admin-identifier-mac-address-tab.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    WidgetAdminIdentifierNumberplateTabComponent,
    WidgetAdminIdentifierMacAddressTabComponent
  ],
  declarations: [WidgetAdminIdentifierNumberplateTabComponent, WidgetAdminIdentifierMacAddressTabComponent]
})
export class WidgetAdminIdentifierAdditionalTabsModule {
}
