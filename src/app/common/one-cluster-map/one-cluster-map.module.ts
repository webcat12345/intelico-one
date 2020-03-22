import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { OneClusterMapComponent } from './one-cluster-map.component';

@NgModule({
  declarations: [OneClusterMapComponent],
  imports: [
    CommonModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule
  ],
  exports: [
    OneClusterMapComponent
  ]
})
export class OneClusterMapModule {
}
