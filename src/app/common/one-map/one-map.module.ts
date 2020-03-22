import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { OneMapComponent } from './one-map.component';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    OneMapComponent
  ],
  declarations: [OneMapComponent]
})
export class OneMapModule {
}
