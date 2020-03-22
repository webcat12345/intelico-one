import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-weekday-selector',
  templateUrl: './weekday-selector.component.html',
  styleUrls: ['./weekday-selector.component.scss']
})
export class WeekdaySelectorComponent implements OnInit {

  @Input() values = [];
  @Input() disabled = true;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  options: any = {Mon: true, Tues: true, Wed: true, Thr: true, Fri: true, Sat: true, Sun: true};
  weekdays = [
    {id: 'chbMonday', label: 'Mon', value: 'Mon'},
    {id: 'chbTuesday', label: 'Tue', value: 'Tues'},
    {id: 'chbWednesday', label: 'Wed', value: 'Wed'},
    {id: 'chbThursday', label: 'Thu', value: 'Thr'},
    {id: 'chbFriday', label: 'Fri', value: 'Fri'},
    {id: 'chbSaturday', label: 'Sat', value: 'Sat'},
    {id: 'chbSunday', label: 'Sun', value: 'Sun'},
  ];

  constructor() {
  }

  ngOnInit() {
    this.values.forEach(x => {
      this.options[x] = true;
    });
  }

  onChange(e) {
    const res = Object.keys(this.options).filter(key => {
      if (this.options[key]) {
        return key;
      }
    });
    this.select.emit(res);
  }

  toggleAll(flag: boolean) {
    this.disabled = flag;
    let res = [];
    if (this.disabled) {
      Object.keys(this.options).map(key => {
        this.options[key] = true;
        return key;
      });
      res = ['All'];
    } else {
      res = Object.keys(this.options).map(key => {
        this.options[key] = false;
      });
      res = [];
    }
    this.select.emit(res);
  }

}
