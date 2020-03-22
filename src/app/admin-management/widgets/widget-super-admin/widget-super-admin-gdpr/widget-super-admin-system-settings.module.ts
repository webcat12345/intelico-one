import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { WidgetSuperAdminSystemSettingsComponent } from './widget-super-admin-system-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
  ],
  exports: [
    WidgetSuperAdminSystemSettingsComponent,
  ],
  declarations: [
    WidgetSuperAdminSystemSettingsComponent],
  entryComponents: [
    WidgetSuperAdminSystemSettingsComponent,
  ]
})
export class WidgetSuperAdminSystemSettingsModule {
}
