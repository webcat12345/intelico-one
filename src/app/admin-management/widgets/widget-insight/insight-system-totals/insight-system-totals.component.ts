import { Component, OnInit } from '@angular/core';
// One - Services
import { Chart } from 'angular-highcharts';
import { Options } from 'highcharts';
import { ReportService } from '@one-core/service/report.service';
import { formatNumber } from '../../../../core/utils/common.util';
import { Priority, ReportType, TotalAlertByPriority } from '@one-core/model';
import { alertBarOptions, getLabelsForTimeLine, getReportTypeForTimeLine, systemTotal, systemTotalLeft } from '../../../../core/utils/insight.util';
import { first } from 'rxjs/operators';
import { isSchemaOn } from '../../../../core/utils/report-schema';

@Component({
  selector: 'one-admin-insight-system-totals',
  templateUrl: './insight-system-totals.component.html',
  styleUrls: ['./insight-system-totals.component.scss']
})
export class InsightSystemTotalsComponent implements OnInit {

  systemTotal = new Chart(systemTotal);
  systemTotalLeft = new Chart(systemTotalLeft);
  start: string;
  end: string;

  chart: Chart;
  // options: Options;
  options;

  constructor(private reportService: ReportService) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.options = {
      title: {
        text: 'Chart.update'
      },

      subtitle: {
        text: 'Plain'
      },

      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },

      series: [{
        type: 'column',
        colorByPoint: true,
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        showInLegend: false
      }]
    };
    const chart = new Chart(this.options);
    chart.addPoint(4);
    this.chart = chart;
    chart.addPoint(5);
    setTimeout(() => {
      chart.addPoint(6);
    }, 2000);

    chart.ref$.subscribe(c => {
    });
  }

  search(start, end) {
    try {
      this.start = start;
      this.end = end;
      this.getTotalAlertByPriority();
      this.getTotalAlertsByHours();
    } catch (e) {

    } finally {

    }
  }

  addPoint() {
    if (this.chart) {
      this.chart.addPoint(Math.floor(Math.random() * 100));
    } else {
      alert('init chart, first!');
    }
  }

  plain() {
    this.chart.ref$.pipe(first()).subscribe(chart => {
      this.updateChart({
        chart: {
          inverted: false,
          polar: false
        },
        subtitle: {
          text: 'Plain'
        }
      });
    });
  }

  inverted() {
    this.chart.ref$.pipe(first()).subscribe(chart => {
      this.updateChart({
        chart: {
          inverted: true,
          polar: false
        },
        subtitle: {
          text: 'Inverted'
        }
      });
    });
  }

  polar() {
    this.chart.ref$.pipe(first()).subscribe(chart => {
      this.updateChart({
        chart: {
          styledMode: true
        },

        title: {
          text: 'Pie point CSS'
        },

        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
          type: 'abands',
          allowPointSelect: true,
          keys: ['name', 'y', 'selected', 'sliced'],
          data: [
            ['Apples', 29.9, false],
            ['Pears', 71.5, false],
            ['Oranges', 106.4, false],
            ['Plums', 129.2, false],
            ['Bananas', 144.0, false],
            ['Peaches', 176.0, false],
            ['Prunes', 135.6, true, true],
            ['Avocados', 148.5, false]
          ],
          showInLegend: true
        }]
      });
    });
  }

  changeType() {
    // this.chart.options.chart = {type: 'column'};
    this.chart.ref$.pipe(first()).subscribe(chart => {
      // chart.update({ chart: { type: 'column' } });
      this.updateChart({
        chart: {
          inverted: false,
          polar: true
        },
        subtitle: {
          text: 'Polar'
        },

        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
          type: 'column',
          colorByPoint: true,
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          showInLegend: false
        }]
      });
    });
  }

  removePoint() {
    this.chart.removePoint(this.chart.ref.series[0].data.length - 1);
  }

  removeSerie() {
    this.chart.removeSeries(this.chart.ref.series.length - 1);
  }

  private updateChart(options: Options) {
    this.chart = new Chart({...this.options, ...options});
  }

  private async getTotalAlertByPriority() {
    try {
      //  this.totalAlertsByPriorityLoading = true;
      const res: any = await this.reportService.getReport(ReportType.TotalAlertsByPriority, this.start, isSchemaOn(this.start, this.end)).toPromise();
      if (res.data) {
        const tmp: TotalAlertByPriority = {normal: 0, critical: 0, high: 0};
        res.data.forEach(x => {
          if (x.row[0] === Priority.Normal) {
            tmp.normal = x.row[1];
          } else if (x.row[0] === Priority.High) {
            tmp.high = x.row[1];
          } else {
            tmp.critical = x.row[1];
          }
        });
        //  this.totalAlertsByPriority = tmp;
      }
    } catch (e) {
      //  this.toastr.error(null, e);
    } finally {
      //  this.totalAlertsByPriorityLoading = false;
    }
  }

  private async getTotalAlertsByHours() {
    try {
      //  this.alertsReportLoading = true;
      const type = getReportTypeForTimeLine(this.start, this.end, 0);
      const res: any = await this.reportService.getReport(type, this.start, isSchemaOn(this.start, this.end)).toPromise();
      const labels = getLabelsForTimeLine(this.start, this.end, 0);
      let values = [];
      if (res && res.data) {
        values = labels.map(label => {
          const val = res.data.find(item => {
            if (type === ReportType.TotalAlertsByHours) {
              return label === `${formatNumber(item.row[3])}:00`;
            } else if (type === ReportType.TotalAlertsByMonth) {
              return label === `${item.row[0]}/${item.row[1]}`;
            } else if (type === ReportType.TotalAlertsByYear) {
              return label === `${item.row[0]}`;
            } else {
              return label === `${item.row[0]}-${item.row[1]}-${item.row[2]}`;
            }
          });
          return val ? val.row[val.row.length - 1] : 0;
        });
      }
      labels.map((item, index) => {
        labels[index] = index;
      });
      this.systemTotalLeft = new Chart({
        ...alertBarOptions,
        xAxis: {
          ...alertBarOptions.xAxis,
          categories: labels
        },
        series: [
          {
            ...alertBarOptions.series[0],
            data: values
          }
        ]
      });
    } catch (e) {
      // this.toastr.error(null, e);
    } finally {
      //  this.alertsReportLoading = false;
    }
  }

}
