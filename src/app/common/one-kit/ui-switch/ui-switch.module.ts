import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchComponent } from '@one-common/ui-kit/ui-switch/ui-switch.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UiSwitchComponent
  ],
  exports: [
    UiSwitchComponent
  ]
})
export class UiSwitchModule {
}
