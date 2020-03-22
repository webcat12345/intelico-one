import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'one-admin-widget-admin-zone-location-map',
  templateUrl: './widget-admin-zone-location-map.component.html',
  styleUrls: ['./widget-admin-zone-location-map.component.scss']
})
export class WidgetAdminZoneLocationMapComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() zone: any;
  @Output() changeLocation: EventEmitter<any> = new EventEmitter();

  center = {lat: 51.5074, lng: 0.1278};

  constructor() {
  }

  ngOnInit() {
    if (!this.isNew) {
      this.center.lat = this.zone.latitude;
      this.center.lng = this.zone.longitude;
    }
  }

  changePosition(e) {
    if (e) {
      this.center.lng = e.lng;
      this.center.lat = e.lat;
      this.changeLocation.emit(this.center);
    }
  }

  centerChangeLat(e) {
    if (e) {
      this.center.lat = e;
      this.changeLocation.emit(this.center);
    }
  }

  centerChangeLng(e) {
    if (e) {
      this.center.lng = e;
      this.changeLocation.emit(this.center);
    }
  }

}
