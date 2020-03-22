import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { ClusterMapItem } from '@one-core/model';
import { OneClusterMapComponent } from '../../../../common/one-cluster-map/one-cluster-map.component';


@Component({
  selector: 'one-admin-widget-assets-map',
  templateUrl: './assets-map.component.html',
  styleUrls: ['./assets-map.component.scss']
})
export class AssetsMapComponent implements OnInit {

  @Input() sidebarFilter = '';
  @Input() data: ClusterMapItem[];
  @Input() searchKeyFilter = '';
  @Output() newAssetsArrived: EventEmitter<any> = new EventEmitter();

  @ViewChild(OneClusterMapComponent, {static: true}) map: OneClusterMapComponent;
  isLoading = false;

  constructor() {
  }

  ngOnInit() {
  }
}
