import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-ui-switch',
  templateUrl: './ui-switch.component.html',
  styleUrls: ['./ui-switch.component.scss']
})
export class UiSwitchComponent implements OnInit {

  @Input() label = {positive: 'Any', negative: 'Specific'};
  @Input() value = false;
  @Input() isOnOffSwitch = false;
  @Input() isRightFloating = true;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  id = '';

  constructor() {
  }

  ngOnInit(): void {
    this.id = Math.random().toString(36).substring(7);
  }

  onChange(e): void {
    this.select.emit(this.value);
  }
}
