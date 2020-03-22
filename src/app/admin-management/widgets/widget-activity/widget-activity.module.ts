import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NgPipesModule } from 'ngx-pipes';
import { OneMapModule } from '@one-common/map';
import { OnePipeModule } from '@one-common/pipe';
import { ChartModule } from 'angular-highcharts';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { OneDirectiveModule } from '@one-common/directive';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneClusterMapModule } from '../../../common/one-cluster-map/one-cluster-map.module';
import { ExpansionTableModule } from '@one-common/ui-kit/expansion-table/expansion-table.module';
import { EventDetailedInfoPanelModule } from '@one-common/ui-kit/event-detailed-info-panel/event-detailed-info-panel.module';

import { WidgetActivityComponent } from './widget-activity.component';
import { ActivityMapComponent } from './activity-map/activity-map.component';
import { ActivityTableComponent } from './activity-table/activity-table.component';
import { ActivityFilterComponent } from './activity-filter/activity-filter.component';
import { ActivityReportsComponent } from './activity-reports/activity-reports.component';
import { ActivityReportTypeComponent } from './activity-reports/activity-report-type/activity-report-type.component';
import { ActivityReportGraphsComponent } from './activity-reports/activity-report-graphs/activity-report-graphs.component';
import { ActivityReportMetadataComponent } from './activity-reports/activity-report-metadata/activity-report-metadata.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    OneDirectiveModule,
    OneWindowModule,
    OneFilterModule,
    OneMapModule,
    ReactiveFormsModule,
    NgPipesModule,
    NgSelectModule,
    EventDetailedInfoPanelModule,
    ExpansionTableModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    OnePipeModule,
    LoaderModule,
    OneClusterMapModule
  ],
  exports: [
    WidgetActivityComponent
  ],
  declarations: [
    ActivityMapComponent,
    WidgetActivityComponent,
    ActivityFilterComponent,
    ActivityTableComponent,
    ActivityReportsComponent,
    ActivityReportTypeComponent,
    ActivityReportGraphsComponent,
    ActivityReportMetadataComponent,
  ],
  entryComponents: [
    WidgetActivityComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WidgetActivityModule {
}
