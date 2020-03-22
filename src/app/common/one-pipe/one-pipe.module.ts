import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderByField } from './order-by-field.pipe';
import { DeepObjectPipe } from './deep-object.pipe';
import { FirstLetterPipe } from './first-letter-pipe';
import { IdentifierTypeIconPipe } from './identifier-type-icon.pipe';
import { LocationDetailAddressPipe } from './location-detail-address.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    OrderByField,
    DeepObjectPipe,
    FirstLetterPipe,
    LocationDetailAddressPipe,
    IdentifierTypeIconPipe,
  ],
  declarations: [
    OrderByField,
    DeepObjectPipe,
    FirstLetterPipe,
    LocationDetailAddressPipe,
    IdentifierTypeIconPipe,
  ]
})
export class OnePipeModule {
}
