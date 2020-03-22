import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from './time-picker.component';

@NgModule({
  declarations: [TimePickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TimePickerComponent
  ]
})
export class TimePickerModule {
}
