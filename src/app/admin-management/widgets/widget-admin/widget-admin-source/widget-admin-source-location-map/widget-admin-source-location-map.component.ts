import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export interface ZonesLocation {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'one-admin-widget-admin-source-location-map',
  templateUrl: './widget-admin-source-location-map.component.html',
  styleUrls: ['./widget-admin-source-location-map.component.scss']
})
export class WidgetAdminSourceLocationMapComponent implements OnInit, OnChanges {

  @Input() isNew: boolean;
  @Input() source: any;
  @Input() zonesLocation: ZonesLocation;
  @Output() changeLocation: EventEmitter<any> = new EventEmitter();

  center = {lat: 33, lng: 22};

  constructor() {
  }

  ngOnInit() {
    if (!this.isNew) {
      this.center.lat = this.source.latitude;
      this.center.lng = this.source.longitude;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.center.lat = this.zonesLocation.latitude;
    this.center.lng = this.zonesLocation.longitude;
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
