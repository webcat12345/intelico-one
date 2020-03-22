import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// One - Services
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { LayerSelectorComponent } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { SourceFilterComponent } from '@one-common/filter/source-filter/source-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  declarations: [
    LayerSelectorComponent,
    SourceFilterComponent

  ],
  exports: [
    LayerSelectorComponent,
    SourceFilterComponent

  ]
})
export class LayerSelectorModule {
}
