import { Component, Input } from '@angular/core';
// One - Services
import { LatLngBounds } from '@agm/core';
import { ClusterMapItem } from '@one-core/model';
import { mapOptions, mapOptionsDark } from '../../core/utils/google-map.util';

import { NotificationService } from '@one-core/service/notification.service';
import { ToastrService } from '../../admin-management/services/toastr.service';

export interface IDisplayedData {
  source: boolean;
  site: boolean;
  area: boolean;
  zone: boolean;
  total?: boolean;
}

@Component({
  selector: 'one-admin-one-cluster-map',
  templateUrl: './one-cluster-map.component.html',
  styleUrls: ['./one-cluster-map.component.scss']
})
export class OneClusterMapComponent {

  @Input() data: ClusterMapItem[];
  @Input() typeInformation = 'Source';
  @Input() styleBottomPx = -176;
  @Input() displayedData: IDisplayedData = {source: true, site: true, area: true, zone: true};
  map: any;

  mapOptions = mapOptionsDark;
  center = {lat: 51.5074, lng: 0.1278};

  constructor(
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {
  }

  mapReady(e): void {
    this.map = e;
    this.checkMapUpdates();
  }

  checkMapUpdates(isDataLoaded = false): void {
    if (this.map) {
      if (this.data && this.data.length) {
        this.map.fitBounds(this.findMapBounds());
      } else {
        if (isDataLoaded) {
          this.toastrService.warning('There are currently no items to display on the map.');
        }
      }
    }
  }

  beforeOpen(item: ClusterMapItem): void {
    if (this.map) {
      this.map.panTo({lat: +item.lat, lng: +item.long});
    }
  }


  private findMapBounds(): LatLngBounds {
    // @ts-ignore
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    for (const item of this.data) {
      // @ts-ignore
      bounds.extend(new google.maps.LatLng(item.lat, item.long));
    }
    return bounds;
  }

}
