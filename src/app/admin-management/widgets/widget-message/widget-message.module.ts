import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetMessageComponent } from './widget-message.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    WidgetMessageComponent
  ],
  exports: [
    WidgetMessageComponent
  ],
  entryComponents: [
    WidgetMessageComponent
  ]
})
export class WidgetMessageModule {
}
