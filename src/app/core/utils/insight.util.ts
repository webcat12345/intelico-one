import { getDiffDays } from './time.util';
import { ReportType } from '@one-core/model';
import { formatNumber } from './common.util';
import { SeriesColumnOptions } from 'highcharts';

export const systemTotal = {
  chart: {
    type: 'column',
  },
  colors: ['#00c3f2'],
  title: {
    text: null
  },
  yAxis: {
    visible: false
  },
  xAxis: {
    reversed: false,
    categories: [],
    title: {
      text: null
    }
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false
  },
  series: [
    {
      type: 'column',
      borderRadius: 3,
      groupPadding: 0,
      name: '',
      data: []
    } as SeriesColumnOptions
  ]
};

export const systemTotalLeft: any = {
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

export const totalAlertsByIdentifiers: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Total Alerts By Identifiers'
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        connectorColor: 'silver'
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    name: '',
    data: []
  }]
};
export const totalAlertsByName: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Total Alerts By Name'
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        connectorColor: 'silver'
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    name: '',
    data: []
  }]
};
export const totalAlertsByActionReason: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Total Alerts By ActionReason'
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        connectorColor: 'silver'
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    name: '',
    data: []
  }]
};
export const totalAlertsByStatus: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Total Alerts By Status'
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        connectorColor: 'silver'
      }
    }
  },
  credits: {
    enabled: false
  },
  series: [{
    name: '',
    data: []
  }]
};

export const totalEventsExit: any = {
  chart: {
    type: 'column',
    // styledMode: true
  },
  colors: ['#600010'],

  title: {
    text: null
  },

  yAxis: [{
    title: {
      text: null
      // text: 'Enter events'
    }
  }, {
    opposite: true,
    title: {
      text: null
      //  text: 'Exit events'
    }
  }],
  credits: {
    enabled: false
  },

  plotOptions: {
    column: {
      borderRadius: 5
    }
  },

  series: [{
    name: 'Exit',
    data: []
  }]
};

export const totalEventsEnter: any = {
  chart: {
    type: 'column',
    // styledMode: true
  },
  colors: ['#126000'],

  title: {
    text: null
  },

  yAxis: [{
    title: {
      text: null
      // text: 'Enter events'
    }
  }, {
    opposite: true,
    title: {
      text: null
      //  text: 'Exit events'
    }
  }],
  credits: {
    enabled: false
  },

  plotOptions: {
    column: {
      borderRadius: 5
    }
  },

  series: [{
    name: 'Enter',
    data: []
  }]
};

export const totalEventsEnterExit: any = {
  chart: {
    type: 'column',
    // styledMode: true
  },
  colors: ['#126000', '#600010'],

  title: {
    text: null
  },

  yAxis: [{
    title: {
      text: null
      // text: 'Enter events'
    }
  }, {
    opposite: true,
    title: {
      text: null
      //  text: 'Exit events'
    }
  }],
  credits: {
    enabled: false
  },

  plotOptions: {
    column: {
      borderRadius: 5
    }
  },

  series: [{
    name: 'Enter',
    data: []
  }, {
    name: 'Exit',
    data: [],
    yAxis: 1
  }]
};

export const alertBarOptions = {
  chart: {
    type: 'column',
  },
  colors: ['#00c3f2'],
  title: {
    text: null
  },
  yAxis: {
    visible: true,
    title: {
      text: null
    },
    allowDecimals: false
  },
  xAxis: {
    reversed: false,
    categories: [],
    title: {
      text: null
    },
    labels: {
      rotation: -90,
    },
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false
  },
  series: [
    {
      type: 'column',
      borderRadius: 3,
      groupPadding: 0,
      name: '',
      data: []
    } as SeriesColumnOptions
  ]
};

export function getReportTypeForTimeLine(start: string, end: string, insightType: number): ReportType {
  const diff = getDiffDays(start, end);
  if (diff <= 0.04165509259259259) {
    if (insightType === 110) {
      return ReportType.TotalActivityByMetadata;
    } else if (insightType === 111) {
      return ReportType.TotalActivityMinutes;
    } else if (insightType === 1) {
      return ReportType.TotalAlertsByMinutes;
    } else if (insightType === 2) {
      return ReportType.TotalOpenAlertsByMinutes;
    } else if (insightType === 3) {
      return ReportType.TotalResolvedAlertsByMinutes;
    } else if (insightType === 215) {
      return ReportType.LongestOpenAlerts;
    }
  }
  if (diff > 0.04165509259259259 && diff <= 0.999988425925926) {
    if (insightType === 110) {
      return ReportType.TotalActivityByMetadata;
    } else if (insightType === 111) {
      return ReportType.TotalActivityByHours;
    } else if (insightType === 1) {
      return ReportType.TotalAlertsByHours;
    } else if (insightType === 2) {
      return ReportType.TotalOpenAlertsByHours;
    } else if (insightType === 3) {
      return ReportType.TotalResolvedAlertsByHours;
    } else if (insightType === 112) {
      return 112;
    } else if (insightType === 215) {
      return ReportType.LongestOpenAlerts;
    } else if (insightType === 226) {
      return 226;
    }
  } else if (diff > 1 && diff <= 30.999988425925928) {
    if (insightType === 110) {
      return ReportType.TotalActivityByMetadata;
    } else if (insightType === 111) {
      return ReportType.TotalActivityByDay;
    } else if (insightType === 1) {
      return ReportType.TotalAlertsByDay;
    } else if (insightType === 2) {
      return ReportType.TotalOpenAlertsByDay;
    } else if (insightType === 3) {
      return ReportType.TotalResolvedAlertsByDay;
    } else if (insightType === 112) {
      return 112;
    } else if (insightType === 215) {
      return ReportType.LongestOpenAlerts;
    } else if (insightType === 226) {
      return 226;
    }
  } else if (diff >= 30.999988425925928 && diff < 367) {
    if (insightType === 110) {
      return ReportType.TotalActivityByMetadata;
    } else if (insightType === 111) {
      return ReportType.TotalActivityByMonth;
    } else if (insightType === 1) {
      return ReportType.TotalAlertsByMonth;
    } else if (insightType === 2) {
      return ReportType.TotalOpenAlertsByMonth;
    } else if (insightType === 3) {
      return ReportType.TotalResolvedAlertsByMonth;
    } else if (insightType === 112) {
      return 112;
    } else if (insightType === 215) {
      return ReportType.LongestOpenAlerts;
    } else if (insightType === 226) {
      return 226;
    }
  } else {
    if (insightType === 110) {
      return ReportType.TotalActivityByMetadata;
    } else if (insightType === 111) {
      return ReportType.TotalActivityByYear;
    } else if (insightType === 1) {
      return ReportType.TotalAlertsByYear;
    } else if (insightType === 2) {
      return ReportType.TotalOpenAlertsByYear;
    } else if (insightType === 3) {
      return ReportType.TotalResolvedAlertsByYear;
    } else if (insightType === 112) {
      return 112;
    } else if (insightType === 215) {
      return ReportType.LongestOpenAlerts;
    } else if (insightType === 226) {
      return 226;
    }
  }
}

export function getLabelsForTimeLine(start: string, end: string, insightType: number) {
  const type = getReportTypeForTimeLine(start, end, insightType);
  if (type === ReportType.TotalActivityMinutes || type === ReportType.TotalAlertsByMinutes || type === 231) {
    const res = [];
    for (let i = 0; i <= 60; i++) {
      res.push(`00:${formatNumber(i)}`);
    }
    return res;
  } else if (type === ReportType.TotalActivityByHours || type === ReportType.TotalAlertsByHours || type === 230) {
    const res = [];
    for (let i = 0; i <= 23; i++) {
      res.push(`${formatNumber(i)}:00`);
    }
    return res;
  } else if (type === ReportType.TotalActivityByMonth || type === ReportType.TotalAlertsByMonth || type === 228) {
    const tmp1 = new Date(start).getFullYear() * 12 + new Date(start).getMonth();
    const tmp2 = new Date(end).getFullYear() * 12 + new Date(end).getMonth();
    const res = [];
    for (let i = tmp1; i <= tmp2; i++) {
      // res.push(`${Math.floor(i / 12)}/${i % 12 + 1}`);
      res.push(`${i % 12 + 1}/${Math.floor(i / 12)}`);
    }
    return res;
  } else if (type === ReportType.TotalActivityByYear || type === ReportType.TotalAlertsByYear || type === 227) {
    const tmp1 = new Date(start).getFullYear();
    const tmp2 = new Date(end).getFullYear();
    const res = [];
    for (let i = tmp1; i <= tmp2; i++) {
      res.push(`${i}`);
    }
    return res;
  } else if (
    type === ReportType.TotalActivity ||
    type === 112 ||
    type === 226 ||
    type === 215 ||
    type === 110
  ) {
    return [];
  } else {
    const res = [];
    const diff = getDiffDays(start, end);
    for (let i = 0; i < diff; i++) {
      const x = new Date(start).setDate(new Date(start).getDate() + i);
      // res.push(`${new Date(x).getFullYear()}-${new Date(x).getMonth() + 1}-${new Date(x).getDate() + 1}`);
      res.push(`${new Date(x).getDate()}/${new Date(x).getMonth() + 1}/${new Date(x).getFullYear()}`);
    }
    return res;
  }
}
