import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { AddressAutoCompleteInputComponent } from './address-auto-complete-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NguiAutoCompleteModule
  ],
  exports: [
    AddressAutoCompleteInputComponent
  ],
  declarations: [
    AddressAutoCompleteInputComponent
  ]
})
export class AddressAutoCompleteInputModule {
}
