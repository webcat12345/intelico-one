import { Component, Input, OnInit } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { Asset } from '@one-core/service/assets.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SourceService } from '@one-core/service/source.service';
import { LayerService } from '@one-core/service/layer.service';

@Component({
  selector: 'one-admin-assets-location-form',
  templateUrl: './assets-location-form.component.html',
  styleUrls: ['./assets-location-form.component.scss']
})
export class AssetsLocationFormComponent implements OnInit {

  @Input() asset: Asset;
  @Input() isNew: boolean;

  isLoadingLayer = false;
  selectSource: FormGroup = this.fb.group({
    source_name: ['']
  });
  sources: Array<any> = [];
  sourcesUI: Array<any> = [];
  loadOnce = true;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private sourceService: SourceService,
    private layerService: LayerService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.selectSource.controls.source_name.setValue('default');
    this.subscriptions.push(
      this.selectSource.get('source_name').valueChanges.subscribe(source => {
        if (source) {
          this.sources.map((item) => {
            if (source === item.name) {
              this.asset.sourceId = item.id;
              if (+this.asset.sourceId > 0) {
                this.changeCenterMapSource(+this.asset.sourceId);
              }
            }
          });
        }
      }));

    this.sourceService.getSources()
      .subscribe(
        sources => {
          if (sources) {
            this.sources = sources.data;
            if (!this.isNew || this.asset.sourceId) {
              this.sources.map((item) => {
                if (item.id === this.asset.sourceId) {
                  this.selectSource.controls.source_name.setValue(item.name);
                }
              });
            }
          }
        }
      );
  }

  selectedZone(e): void {
    this.asset.areaId = +e.areaId;
    this.asset.siteId = +e.siteId;
    this.asset.zoneId = +e.zoneId;
    if (+e.zoneId > 0 && this.loadOnce) {
      this.changeCenterMapZone(+e.zoneId);
      this.setSource(+e.zoneId);
      this.loadOnce = false;
    }
    setTimeout(() => {
      this.loadOnce = true;
    }, 1000);
  }

  setSource(zoneId: number): void {
    this.sourcesUI = [];
    this.sources.map((item) => {
      if (item.zoneId === zoneId) {
        this.sourcesUI.push(item);
      }
    });
  }

  changeCenterMapSource(id: number): void {
    this.sourceService.getSources()
      .subscribe(
        resp => {
          if (resp.data.length > 0) {
            resp.data.map((item) => {
              if (item.id === id) {
                this.asset.latitude = item.latitude;
                this.asset.longitude = item.longitude;
              }
            });
          }
        }, error => console.error(error)
      );
  }

  changeCenterMapZone(id: number): void {
    this.layerService.getLayerDetail(id)
      .subscribe(
        resp => {
          this.asset.latitude = resp.item.metaData.address.latitude;
          this.asset.longitude = resp.item.metaData.address.longitude;
        }, error => console.error(error)
      );
  }
}
