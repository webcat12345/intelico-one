import { Component, Input, OnInit } from '@angular/core';
// One - Services
import { Asset } from '@one-core/service/assets.service';

@Component({
  selector: 'one-admin-assets-location-map',
  templateUrl: './assets-location-map.component.html',
  styleUrls: ['./assets-location-map.component.scss']
})
export class AssetsLocationMapComponent implements OnInit {

  @Input() asset: Asset;
  @Input() isNew: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.asset.longitude = +this.asset.longitude;
      this.asset.latitude = +this.asset.latitude;
    }
  }

  changePosition(e): void {
    if (e) {
      this.asset.longitude = e.lng;
      this.asset.latitude = e.lat;
    }
  }
}
