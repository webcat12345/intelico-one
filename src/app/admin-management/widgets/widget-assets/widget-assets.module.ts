import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OneDirectiveModule } from '@one-common/directive';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { OneMapModule } from '@one-common/map';
import { EventDetailedInfoPanelModule } from '@one-common/ui-kit/event-detailed-info-panel/event-detailed-info-panel.module';
import { ExpansionTableModule } from '@one-common/ui-kit/expansion-table/expansion-table.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OnePipeModule } from '@one-common/pipe';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneClusterMapModule } from '../../../common/one-cluster-map/one-cluster-map.module';
import { LayerSelectorModule } from '@one-common/ui-kit/layer-selector/layer-selector.module';
// One - Services
import { WidgetAssetsStateService } from './services/widget-assets-state.service';
// One - Components
import { AssetsMapComponent } from './widget-assets-map/assets-map.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { WidgetAssetsComponent } from './widget-assets.component';
import { AssetsDetailsComponent } from './assets-details/assets-details.component';
import { AssetsBadgeComponent } from './assets-badge/assets-badge.component';
import { AssetsDetailsFormComponent } from './assets-details/assets-details-form/assets-details-form.component';
import { AssetsLocationComponent } from './assets-location/assets-location.component';
import { AssetsLocationMapComponent } from './assets-location/assets-location-map/assets-location-map.component';
import { AssetsLocationFormComponent } from './assets-location/assets-location-form/assets-location-form.component';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';

@NgModule({
  declarations: [
    AssetsMapComponent,
    AssetsBadgeComponent,
    AssetsTableComponent,
    AssetsFilterComponent,
    WidgetAssetsComponent,
    AssetsDetailsComponent,
    AssetsLocationComponent,
    AssetsLocationMapComponent,
    AssetsDetailsFormComponent,
    AssetsLocationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayerSelectorModule,
    ReactiveFormsModule,
    OneDirectiveModule,
    OneWindowModule,
    OneFilterModule,
    OneMapModule,
    EventDetailedInfoPanelModule,
    ExpansionTableModule,
    TooltipModule.forRoot(),
    OnePipeModule,
    LoaderModule,
    OneClusterMapModule
  ],
  exports: [
    WidgetAssetsComponent
  ],
  entryComponents: [
    WidgetAssetsComponent
  ],
  providers: [
    WidgetAssetsStateService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WidgetAssetsModule {
}
