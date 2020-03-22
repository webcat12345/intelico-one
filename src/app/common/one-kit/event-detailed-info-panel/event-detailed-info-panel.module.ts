import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailedInfoPanelComponent } from './event-detailed-info-panel.component';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    LoaderModule
  ],
  exports: [
    EventDetailedInfoPanelComponent
  ],
  declarations: [
    EventDetailedInfoPanelComponent
  ]
})
export class EventDetailedInfoPanelModule {
}
