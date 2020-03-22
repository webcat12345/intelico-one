import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface IOptionsData {
  label: string;
  value: string;
}

@Component({
  selector: 'one-admin-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input() value: string;
  @Input() disabled: boolean;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  options: any[] = [];
  optionsData: Array<IOptionsData> = [
    // tslint:disable-next-line
    {label: '00:00:00', value: '00:00:00'}, {label: '01:00:00', value: '01:00:00'}, {label: '02:00:00', value: '02:00:00'}, {label: '03:00:00', value: '03:00:00'}, {label: '04:00:00', value: '04:00:00'}, {label: '05:00:00', value: '05:00:00'}, {label: '06:00:00', value: '06:00:00'}, {
      label: '07:00:00',
      value: '07:00:00'
    }, {label: '08:00:00', value: '08:00:00'},
    // tslint:disable-next-line
    {label: '09:00:00', value: '09:00:00'}, {label: '10:00:00', value: '10:00:00'}, {label: '11:00:00', value: '11:00:00'}, {label: '12:00:00', value: '12:00:00'}, {label: '13:00:00', value: '13:00:00'}, {label: '14:00:00', value: '14:00:00'}, {label: '15:00:00', value: '15:00:00'}, {
      label: '16:00:00',
      value: '16:00:00'
    }, {label: '17:00:00', value: '17:00:00'},
    // tslint:disable-next-line
    {label: '18:00:00', value: '18:00:00'}, {label: '19:00:00', value: '19:00:00'}, {label: '20:00:00', value: '20:00:00'}, {label: '21:00:00', value: '21:00:00'}, {label: '22:00:00', value: '22:00:00'}, {label: '22:00:00', value: '22:00:00'}, {label: '23:00:00', value: '23:00:00'}, {label: '23:59:59', value: '23:59:59'}];

  ngOnInit(): void {
    // this.buildOptions();
  }

  private buildOptions(): void {
    let hours;
    let minutes;
    let ampm;
    let labelHours;
    for (let i = 0; i <= 1425; i += 15) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      if (minutes < 10) {
        minutes = '0' + minutes; // adding leading zero
      }
      ampm = hours % 24 < 12 ? 'AM' : 'PM';
      labelHours = hours % 12;
      if (labelHours === 0) {
        labelHours = 12;
      }
      this.options.push({label: `${labelHours > 9 ? labelHours : `0${labelHours}`}:${minutes} ${ampm}`, value: `${hours > 9 ? hours : `0${hours}`}:${minutes}:00`});
    }
    this.options.push({label: `11:59 PM`, value: `23:59:59`});
  }

}
