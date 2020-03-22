import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NgSelectModule } from '@ng-select/ng-select';

import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { OnePipeModule } from '@one-common/pipe';
import { EventDetailedInfoPanelModule } from '@one-common/ui-kit/event-detailed-info-panel/event-detailed-info-panel.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { WidgetLocateComponent } from './widget-locate.component';
import { LocateMapComponent } from './locate-map/locate-map.component';
import { LocateSearchBoxComponent } from './locate-search-box/locate-search-box.component';
import { LocateService } from './services/locate.service';
import { LocateFilterComponent } from './locate-filter/locate-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    NguiAutoCompleteModule,
    NgSelectModule,
    ReactiveFormsModule,
    AgmCoreModule,
    AgmDirectionModule,
    AgmSnazzyInfoWindowModule,
    PaginationModule.forRoot(),
    EventDetailedInfoPanelModule,
    OneWindowModule,
    OneFilterModule,
    OnePipeModule,
    LoaderModule
  ],
  exports: [
    WidgetLocateComponent
  ],
  declarations: [
    WidgetLocateComponent,
    LocateMapComponent,
    LocateSearchBoxComponent,
    LocateFilterComponent,
  ],
  entryComponents: [
    WidgetLocateComponent
  ],
  providers: [
    LocateService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetLocateModule {
}
