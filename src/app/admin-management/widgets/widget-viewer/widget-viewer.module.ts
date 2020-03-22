import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ng2-dnd';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { WidgetViewerComponent } from './widget-viewer.component';
import { WidgetViewerService } from './widget-viewer.service';

@NgModule({
  imports: [
    CommonModule,
    DndModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    WidgetViewerComponent
  ],
  exports: [
    WidgetViewerComponent
  ],
  entryComponents: [
    WidgetViewerComponent
  ],
  providers: [
    WidgetViewerService
  ]
})
export class WidgetViewerModule {
}
