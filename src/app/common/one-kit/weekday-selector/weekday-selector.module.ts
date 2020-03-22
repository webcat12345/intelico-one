import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeekdaySelectorComponent } from '@one-common/ui-kit/weekday-selector/weekday-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WeekdaySelectorComponent
  ],
  exports: [
    WeekdaySelectorComponent
  ]
})
export class WeekdaySelectorModule {
}
