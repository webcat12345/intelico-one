import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgPipesModule } from 'ngx-pipes';
import { ExpansionTableComponent } from './expansion-table.component';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule
  ],
  exports: [
    ExpansionTableComponent
  ],
  declarations: [
    ExpansionTableComponent
  ]
})
export class ExpansionTableModule {
}
