import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetInsightService } from './widget-insight.service';
// One - Modules
import { ChartModule } from 'angular-highcharts';
import { Ng2OdometerModule } from 'ng2-odometer';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
// One - Components
import { WidgetInsightComponent } from './widget-insight.component';
import { InsightContentComponent } from './insight-content/insight-content.component';
import { InsightFilterComponent } from './insight-filter/insight-filter.component';
import { PercentByPriorityPipe } from './percent-by-priority.pipe';
import { InsightSystemTotalsComponent } from './insight-system-totals/insight-system-totals.component';
import { InsightReportTypeFilterComponent } from './insight-filter/insight-report-type-filter/insight-report-type-filter.component';
import { InsightDashboardComponent } from './insight-dashboard/insight-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OneWindowModule,
    ChartModule,
    Ng2OdometerModule.forRoot(),
    TooltipModule.forRoot(),
    OneFilterModule,
    LoaderModule
  ],
  exports: [
    WidgetInsightComponent
  ],
  declarations: [
    WidgetInsightComponent,
    InsightContentComponent,
    InsightDashboardComponent,
    InsightFilterComponent,
    PercentByPriorityPipe,
    InsightSystemTotalsComponent,
    InsightReportTypeFilterComponent
  ],
  entryComponents: [
    WidgetInsightComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    WidgetInsightService
  ]
})
export class WidgetInsightModule {
}
