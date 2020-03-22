import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { ZoneSelectorComponent } from './zone-selector.component';
import { LayerParentPipe } from './layer-parent.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  declarations: [
    ZoneSelectorComponent,
    LayerParentPipe
  ],
  exports: [
    ZoneSelectorComponent
  ]
})
export class ZoneSelectorModule {
}
