import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { mapOptions, mapOptionsDark } from '../../core/utils/google-map.util';

@Component({
  selector: 'one-admin-one-map',
  templateUrl: './one-map.component.html',
  styleUrls: ['./one-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneMapComponent implements OnInit {

  @Input() height: string;
  @Input() position: any;
  @Input() corresponding: { lat: 0, lng: 0 };
  @Input() infoTemplateRef: TemplateRef<any>;
  @Input() lock: boolean;
  @Input() markerClickable: boolean;
  @Input() markerDraggable: boolean;
  @Output() changePosition: EventEmitter<{ lat: number, lng: number }> = new EventEmitter<{ lat: number, lng: number }>();

 // mapOptions: any = mapOptions;
  mapOptions: any = mapOptionsDark;

  newCenterLat: number;
  newCenterLng: number;

  constructor() {
  }

  ngOnInit() {
  }

  mapReady(map) {
    map.addListener('dragend', () => {
      this.changePosition.emit({lat: this.newCenterLat, lng: this.newCenterLng});
    });
  }

  centerChange(e) {
    if (e) {
      this.newCenterLat = e.lat;
      this.newCenterLng = e.lng;
    }
  }

  clickedMarker(e) {
  }

  markerDragEnd(e) {
    this.changePosition.emit({lat: e.coords.lat, lng: e.coords.lng});
  }
}
