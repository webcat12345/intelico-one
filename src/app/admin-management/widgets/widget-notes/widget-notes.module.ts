import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetNotesComponent } from './widget-notes.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    WidgetNotesComponent
  ],
  declarations: [WidgetNotesComponent],
  entryComponents: [
    WidgetNotesComponent
  ]
})
export class WidgetNotesModule {
}
