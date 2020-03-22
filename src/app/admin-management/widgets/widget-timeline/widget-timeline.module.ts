import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DxChartModule, DxRangeSelectorModule } from 'devextreme-angular';
import { WidgetTimelineComponent } from './widget-timeline.component';

@NgModule({
  imports: [
    CommonModule,
    // DxChartModule,
    // DxRangeSelectorModule
  ],
  declarations: [
    WidgetTimelineComponent
  ],
  entryComponents: [
    WidgetTimelineComponent
  ]
})
export class WidgetTimelineModule {
}
