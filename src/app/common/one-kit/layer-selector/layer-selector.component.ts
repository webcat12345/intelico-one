import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// One - Services
import { map } from 'rxjs/operators';
import { LayerCategory, Source } from '@one-core/model';
import { removeDuplicates } from '../../../core/utils/common.util';
import { SourceFilterComponent } from '@one-common/filter/source-filter/source-filter.component';

import { LayerService } from '@one-core/service/layer.service';
import { SourceService } from '@one-core/service/source.service';
import { ToastrService } from '../../../admin-management/services/toastr.service';

export interface AssetsData {
  zoneId: number;
  areaId: number;
  siteId: number;
}

@Component({
  selector: 'one-admin-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit, OnChanges {

  @ViewChild(SourceFilterComponent, {static: false}) sourceFilter: SourceFilterComponent;

  @Input() loadFromServer = true;
  @Input() isShowLabel: boolean;
  @Input() isShowAll = true;
  @Input() isZones: boolean;
  @Input() isSource: boolean;
  @Input() isAreas: boolean;
  @Input() isSites: boolean;
  @Input() siteId: number;
  @Input() areaId: number;
  @Input() zoneId: number;
  @Input() layers = {
    sites: [],
    areas: [],
    zones: []
  };
  @Input() isFilter = false;
  @Input() isDisabled: boolean;
  @Input() canBeDisabled: boolean;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectForMapData: EventEmitter<AssetsData> = new EventEmitter<AssetsData>();
  @Output() selectAssets: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterSourceChanged: EventEmitter<any> = new EventEmitter<any>();
  disabled = false;
  layerSelectorForm: FormGroup;
  isLoading = false;
  dataForAssets: AssetsData = {zoneId: -1, areaId: -1, siteId: -1};
  dropdownSources: Array<any>;
  source: string;
  sources: Source[] = [];
  optionLayers = {
    sites: [],
    areas: [],
    zones: []
  };

  constructor(
    private fb: FormBuilder,
    private layerService: LayerService,
    private sourceService: SourceService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.layerSelectorForm = this.fb.group({
      siteId: ['', Validators.required],
      areaId: ['', Validators.required],
      zoneId: ['', Validators.required]
    });
    this.sourceService.getSources(true)
      .subscribe(
        res => {
          this.sources = res.data;
        }, error => {
          console.log(error);
        }
      );

    this.layerSelectorForm.get('siteId').valueChanges.subscribe(x => this.resetAreaOption());
    this.layerSelectorForm.get('areaId').valueChanges.subscribe(x => this.resetZoneOption());
    this.layerSelectorForm.get('zoneId').valueChanges.subscribe(x => this.resetSourceOption());
    this.layerSelectorForm.valueChanges.subscribe(x => this.sendSelection());

    if (this.loadFromServer) {
      this.getLayers();
    } else {
      this.resetSiteOption();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (this.canBeDisabled) {
        if (this.isDisabled) {
          this.layerSelectorForm.get('siteId').disable();
          this.layerSelectorForm.get('areaId').disable();
          this.layerSelectorForm.get('zoneId').disable();
        } else {
          this.layerSelectorForm.get('siteId').enable();
          this.layerSelectorForm.get('areaId').enable();
          this.layerSelectorForm.get('zoneId').enable();
        }
      }
    }, 500);
  }

  async getLayers(): Promise<void> {
    try {
      this.isLoading = true;
      this.layers.sites = await this.layerService.getLayers(LayerCategory.Site).pipe(map((x: any) => x.data)).toPromise();
      this.layers.areas = await this.layerService.getLayers(LayerCategory.Area).pipe(map((x: any) => x.data)).toPromise();
      this.layers.zones = await this.layerService.getLayers(LayerCategory.Zone).pipe(map((x: any) => x.data)).toPromise();
      if (this.siteId && this.areaId && this.zoneId) {
        this.layers.sites.map((item) => {
          this.layers.areas.map((itm) => {
            if (item.id === itm.parentId) {
              this.optionLayers.sites.push(item);
            }
          });
        });
        this.layerSelectorForm.controls.siteId.setValue(this.siteId);
        this.layerSelectorForm.controls.areaId.setValue(this.areaId);
        this.layerSelectorForm.controls.zoneId.setValue(this.zoneId);
      } else if (!this.siteId && !this.areaId && !this.zoneId) {
        this.resetSiteOption();
      }
    } catch (e) {
      this.toastr.error('Something went wrong while fetching layers.', e);
    } finally {
      this.isLoading = false;
    }
  }

  resetSiteOption(): void {
    this.optionLayers.sites = [];
    this.layers.sites.map((item) => {
      this.layers.areas.map((itm) => {
        if (item.id === itm.parentId) {
          this.optionLayers.sites.push(item);
        }
      });
    });
    this.optionLayers.sites = removeDuplicates(this.optionLayers.sites, 'name');
    if (this.optionLayers.sites.length > 0 && !this.isFilter) {
      //  this.layerSelectorForm.get('siteId').setValue(this.optionLayers.sites[0].id);
      this.layerSelectorForm.get('siteId').setValue(-1);
    } else {
      this.layerSelectorForm.get('siteId').setValue(-1);
    }
    this.resetAreaOption();
  }

  resetAreaOption(): void {
    this.optionLayers.areas = this.layers.areas.filter(x => +x.parentId === +this.layerSelectorForm.get('siteId').value);
    this.layerSelectorForm.get('areaId').setValue(-1);
    this.resetZoneOption();
  }

  resetZoneOption(): void {
    this.optionLayers.zones = this.layers.zones.filter(x => +x.parentId === +this.layerSelectorForm.get('areaId').value);
    this.layerSelectorForm.get('zoneId').setValue(-1);
  }

  resetSourceOption(): void {
    this.dropdownSources = this.sources.filter(x => +x.zoneId === +this.layerSelectorForm.get('zoneId').value);
    this.source = 'default';
  }

  sendSelection(): void {
    const value = this.layerSelectorForm.value;
    if (this.isShowLabel) {
      this.dataForAssets.zoneId = +value.zoneId;
      this.selectAssets.emit(this.dataForAssets);
    }
    if (this.isShowLabel) {
      this.dataForAssets.areaId = +value.areaId;
      this.selectAssets.emit(this.dataForAssets);
    }
    if (this.isShowLabel) {
      this.dataForAssets.siteId = +value.siteId;
      this.selectAssets.emit(this.dataForAssets);
    }
    if (this.isFilter) {
      const filterArray = [];
      if (value.zoneId > -1) {
        filterArray.push(`zoneId eq ${value.zoneId}`);
      }
      if (value.areaId > -1) {
        filterArray.push(`areaId eq ${value.areaId}`);
      }
      if (value.siteId > -1) {
        filterArray.push(`siteId eq ${value.siteId}`);
      }
      const filterString = filterArray.join(` and `);
      this.selectForMapData.emit(value);
      if (!this.isLoading) {
        this.select.emit(filterString);
      }
    } else {
      let res = {id: -1, name: 'All'};
      if (value.siteId > -1) {
        if (value.areaId > -1) {
          if (value.zoneId > -1) {
            res = {id: value.zoneId, name: this.layers.zones.find(x => x.id === +value.zoneId).name};
          } else {
            res = {id: value.areaId, name: this.layers.areas.find(x => x.id === +value.areaId).name};
          }
        } else {
          res = {id: value.siteId, name: this.layers.sites.find(x => x.id === +value.siteId).name};
        }
      }
      this.select.emit(res);
    }
  }

  public setAnyMode(flag: boolean): void {
    this.sourceFilter.setDefaultSource();
    this.disabled = flag;
    if (this.disabled === true) {
      this.layerSelectorForm.get('siteId').setValue(-1);
    } else {
      this.resetSiteOption();
    }
  }
}
