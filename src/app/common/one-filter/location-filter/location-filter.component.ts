import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AssetsData, LayerSelectorComponent } from '@one-common/ui-kit/layer-selector/layer-selector.component';

@Component({
  selector: 'one-admin-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss']
})
export class LocationFilterComponent implements OnInit {
  @ViewChild(LayerSelectorComponent, {static: true}) layerSelector: LayerSelectorComponent;
  @Input() isDisabled: boolean;
  @Input() isSource: boolean;
  @Input() isZones: boolean;
  @Input() isAreas: boolean;
  @Input() isSites: boolean;
  @Input() canBeDisabled: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectForMapData: EventEmitter<AssetsData> = new EventEmitter<AssetsData>();
  @Output() filterSourceChanged: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
  }

  clearLocations(): void {
    this.layerSelector.setAnyMode(false);
  }
}
