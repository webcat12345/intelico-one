import { Component, OnInit } from '@angular/core';

// import { DxChartComponent, DxRangeSelectorComponent } from 'devextreme-angular';

export class TimelineData {
  time: number;
  vehicles: number;
  devices: number;
  people: number;
  other: number;
  actions: number;
  notifications: number;
  total: number;
  vehicleValue: string;
  devicesValue: string;
  peopleValue: string;
  otherValue: string;
  actionValue: string;
  notificationValue: string;
}

@Component({
  selector: 'one-admin-widget-timeline',
  templateUrl: './widget-timeline.component.html',
  styleUrls: ['./widget-timeline.component.scss']
})
export class WidgetTimelineComponent implements OnInit {

  // @ViewChild('zoomedChart', { static: true }) zoomedChart: DxChartComponent;
  // @ViewChild('rangeSelector', { static: true }) rangeSelector: DxRangeSelectorComponent;
  timelineData: TimelineData[] = [];

  value = null;

  constructor() {
  }

  ngOnInit() {
    // let a = 0;
    // setInterval(() => {
    //   a += 1;
    //   const data: TimelineData = {
    //     time: a,
    //     vehicles: Math.floor(Math.random() * 11),
    //     devices: Math.floor(Math.random() * 11),
    //     people: Math.floor(Math.random() * 11),
    //     other: Math.floor(Math.random() * 11),
    //     actions: Math.floor(Math.random() * 11),
    //     notifications: Math.floor(Math.random() * 11),
    //     total: 0,
    //     vehicleValue: 'vehicles',
    //     devicesValue: 'devices',
    //     peopleValue: 'people',
    //     otherValue: 'others',
    //     actionValue: 'actions',
    //     notificationValue: 'notifications',
    //   };
    //   Object.keys(data).forEach(x => {
    //     if (x !== 'time' && x !== 'total') {
    //       data.total += data[x];
    //     }
    //   });
    //   this.timelineData.push(data);
    //   if (this.rangeSelector.value) {
    //     this.value = this.rangeSelector.value.slice(0);
    //   } else {
    //     this.value = [this.timelineData[0].time, this.timelineData[this.timelineData.length - 1].time];
    //   }
    // }, 1000);
  }

  onValueChanged(e: any) {
    // this.zoomedChart.instance.zoomArgument(e.value[0], e.value[1]);
  }

  onOptionChanged(e) {
    // this.rangeSelector.value = this.value;
  }

}
