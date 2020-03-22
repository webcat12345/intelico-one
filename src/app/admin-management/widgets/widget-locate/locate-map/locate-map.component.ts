import { Component, Input, OnInit } from '@angular/core';

// One - Services
import { EventListItem } from '@one-core/model';
import { LocateService } from '../services/locate.service';

import { mapOptionsDark } from '../../../../core/utils/google-map.util';
import { ExpansionTableItem } from '../../../../core/utils/expansion-table.util';

@Component({
  selector: 'one-admin-locate-map',
  templateUrl: './locate-map.component.html',
  styleUrls: ['./locate-map.component.scss'],
})
export class LocateMapComponent implements OnInit {

  @Input() position: any = null;
  @Input() address = '';
  @Input() site = '';
  @Input() eventListItem: EventListItem;

  center = {lat: 51.5074, lng: 0.1278, id: null};

  markers: any[] = [];
  mapOptions = mapOptionsDark;
  info: ExpansionTableItem<EventListItem>;

  constructor(
    private locateService: LocateService
  ) {
  }

  ngOnInit(): void {
    this.locateService.locate$.subscribe(res => {
      if (res.identifier) {
        this.info = res.history && res.history[0];
        this.markers = res.history.map((x: any) => ({
          location: {lat: Number(x.data.lat), lng: Number(x.data.long)}, stopover: true,
          display: false,
          id: x.data.id,
          site: x.data.site, zone: x.data.zone, area: x.data.area, source: x.data.source
        }));
      } else {
      }
    });
  }

  changePosition(): void {
    // google map render but need to wait for input binding time
    setTimeout(() => {
      if (this.position) {
        this.center = {lat: this.position.lat, lng: this.position.long, id: this.position.id};
        const index = this.markers.findIndex(x => x.id === this.center.id);
        if (index >= 0) {
          this.markers.forEach(x => x.display = false);
          this.markers[index].display = true;
        }
      }
    }, 100);
  }
}
