import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import { LayerSelectorModule } from '@one-common/ui-kit/layer-selector/layer-selector.module';
// Components
import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { TypeFilterComponent } from './type-filter/type-filter.component';
import { SearchKeyFilterComponent } from './search-key-filter/search-key-filter.component';
import { LocationFilterComponent } from './location-filter/location-filter.component';
import { ValueFilterComponent } from './value-filter/value-filter.component';
import { IdentifierTypeFilterComponent } from './identifier-type-filter/identifier-type-filter.component';
import { ReasonFilterComponent } from '@one-common/filter/reason-filter/reason-filter.component';
import { ResolvedReasonFilterComponent } from '@one-common/filter/resolved-reason-filter/resolved-reason-filter.component';
import { MetadataFilterComponent } from '@one-common/filter/metadata-filter/metadata-filter.component';
import { PersonFilterComponent } from '@one-common/filter/person-filter/person-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    LayerSelectorModule,
    NgSelectModule
  ],
  declarations: [
    DateRangeFilterComponent,
    TypeFilterComponent,
    PersonFilterComponent,
    SearchKeyFilterComponent,
    LocationFilterComponent,
    ValueFilterComponent,
    ReasonFilterComponent,
    MetadataFilterComponent,
    ResolvedReasonFilterComponent,
    IdentifierTypeFilterComponent
  ],
  exports: [
    DateRangeFilterComponent,
    TypeFilterComponent,
    PersonFilterComponent,
    MetadataFilterComponent,
    SearchKeyFilterComponent,
    LocationFilterComponent,
    ValueFilterComponent,
    ReasonFilterComponent,
    ResolvedReasonFilterComponent,
    IdentifierTypeFilterComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class OneFilterModule {
}
