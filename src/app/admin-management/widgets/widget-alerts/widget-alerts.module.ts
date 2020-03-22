import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { OneWindowModule } from '@one-common/window';
import { OneMapModule } from '@one-common/map';
import { OneFilterModule } from '@one-common/filter';
import { EventDetailedInfoPanelModule } from '@one-common/ui-kit/event-detailed-info-panel/event-detailed-info-panel.module';
import { ExpansionTableModule } from '@one-common/ui-kit/expansion-table/expansion-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OnePipeModule } from '@one-common/pipe';
import { OneDirectiveModule } from '@one-common/directive';
import { OneClusterMapModule } from '../../../common/one-cluster-map/one-cluster-map.module';
import { Ng2OdometerModule } from 'ng2-odometer';
import { ChartModule } from 'angular-highcharts';
import { NgPipesModule } from 'ngx-pipes';

import { WidgetAlertsComponent } from './widget-alerts.component';
import { AlertsTableComponent } from './alerts-table/alerts-table.component';
import { AlertsSidebarComponent } from './alerts-sidebar/alerts-sidebar.component';
import { AlertsMapComponent } from './alerts-map/alerts-map.component';
import { AlertsReportsComponent } from './alerts-reports/alerts-reports.component';
import { AlertsReportTypeComponent } from './alerts-reports/alerts-report-type/alerts-report-type.component';
import { AlertsReportResolvedComponent } from './alerts-reports/alerts-report-resolved/alerts-report-resolved.component';
import { AlertsReportGraphsComponent } from './alerts-reports/alerts-report-graphs/alerts-report-graphs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    NgPipesModule,
    ReactiveFormsModule,
    OneWindowModule,
    OneFilterModule,
    OneMapModule,
    LoaderModule,
    EventDetailedInfoPanelModule,
    Ng2OdometerModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    ExpansionTableModule,
    OnePipeModule,
    OneClusterMapModule,
    OneDirectiveModule
  ],
  declarations: [
    WidgetAlertsComponent,
    AlertsTableComponent,
    AlertsSidebarComponent,
    AlertsMapComponent,
    AlertsReportsComponent,
    AlertsReportTypeComponent,
    AlertsReportGraphsComponent,
    AlertsReportResolvedComponent
  ],
  exports: [
    WidgetAlertsComponent
  ],
  entryComponents: [
    WidgetAlertsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WidgetAlertsModule {
}
