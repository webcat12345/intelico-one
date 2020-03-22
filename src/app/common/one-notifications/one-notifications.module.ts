import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneNotificationsComponent } from './one-notifications.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OneNotificationsComponent
  ],
  exports: [
    OneNotificationsComponent
  ]
})
export class OneNotificationsModule {
}
