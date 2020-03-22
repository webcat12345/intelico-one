import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { flyIn } from '@one-animation/flyIn.animation';
import { LayerService } from '@one-core/service/layer.service';
import { ClusterMapItem, LayerCategory } from '@one-core/model';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminZoneAddComponent } from './widget-admin-zone-add/widget-admin-zone-add.component';
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { map } from 'rxjs/operators';
import { ILayersDataNames } from '../widget-admin-source/widget-admin-source.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view'
}

export interface ICenter {
  lat: number;
  lng: number;
}

@Component({
  selector: 'one-admin-widget-admin-zone',
  templateUrl: './widget-admin-zone.component.html',
  styleUrls: ['./widget-admin-zone.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminZoneComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(WidgetAdminZoneAddComponent, {static: false}) addCom: WidgetAdminZoneAddComponent;

  UserRole = UserRole;

  center: ICenter = {lat: 51.5074, lng: 0.1278};
  dataClusterMap: ClusterMapItem[] = [{lat: 12, long: 12, site: '', siteId: 12, total: 12, zone: ''}];
  layersDataNames: ILayersDataNames = {siteName: null, areaName: null, zoneName: null};
  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '20%', isLink: false},
    {label: 'Description', name: 'description', width: '20%', isLink: false},
    {label: 'Type', name: 'typeValue', width: '13%', isLink: false},
    {label: 'Area', name: 'areaValue', width: '13%', isLink: false},
    {label: 'Site', name: 'siteValue', width: '13%', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  searchKey = '';
  isLoading = false;
  loadingOneTime = false;
  showAddModal = false;
  showHideMap = false;
  showConfirmModal = false;
  isAddModal = false;
  selectedZone: any = null;
  zoneList: any = {data: [], totalCount: 0};
  zoneListUI: any = {data: [], totalCount: 0};
  currentView: View = View.ListView;
  View = View;
  layersSites: Array<any>;
  layersAreas: Array<any>;
  layersZones: Array<any>;

  constructor(
    private layerService: LayerService,
    private toastr: ToastrService
  ) {
  }

  get getCenter(): ICenter {
    return this.center;
  }

  ngOnInit(): void {
    this.showAddModal = this.isAddWindow;
    this.isAddModal = this.isAddWindow;
    if (!this.isAddWindow) {
      this.getZones();
    }
  }

  async getZones(): Promise<void> {
    try {
      this.isLoading = true;
      this.zoneList = await this.layerService.getLayers(LayerCategory.Zone).toPromise();
      if (this.zoneList.data.length) {
        this.zoneList.data.map((item) => {
          item.description = item.metaData.description;
          item.typeValue = item.type.value;
          item.areaValue = item.parent.name;
          item.siteValue = item.parent.parent.name;
        });
        this._setDataMap(this.zoneList, this.layersDataNames);
        this._setData(this.zoneList, this.layersDataNames);
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  changeFilter(e): void {
  }

  onCreateZone(): void {
    this.isAddModal = true;
    this.selectedZone = null;
    this.showAddModal = true;
    this.center = {lat: 51.5074, lng: 0.1278};
  }

  async onEditZone(e): Promise<void> {
    this.isAddModal = false;
    const res: any = await this.layerService.getLayerDetail(e.id).toPromise();
    this.selectedZone = res.item;
    this.selectedZone.metaData = res.item.metaData;
    this.center = {lat: res.item.metaData.address.latitude, lng: res.item.metaData.address.longitude};
    this.selectedZone.description = res.item.metaData.description;
    this.showAddModal = true;
    // TODO: hot fix to sync with input data
    setTimeout(() => {
      this.addCom.zoneForm.get('description').setValue(this.selectedZone.description);
      this.addCom.zoneForm.get('metadata').setValue({...res.item.metaData});
    }, 100);
  }

  onDeleteConfirm(e): void {
    this.showConfirmModal = true;
    this.selectedZone = e;
  }

  async onRemoveZone(flag): Promise<void> {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedZone = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.layerService.deleteLayer(this.selectedZone.id).toPromise();
      await this.getZones();
      this.toastr.success('Zone Deleted');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.showConfirmModal = false;
      this.selectedZone = null;
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getZones();
      this.center = {lat: 51.5074, lng: 0.1278};
    }
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

  placeChanged(e): void {
    this.center = e;
  }

  toggleCurrentView(view: View): void {
    this.currentView = view;
    if (this.currentView === View.ListView) {
      this.showHideMap = false;
    }
    if (this.currentView === View.MapView) {
      this.showHideMap = true;
    }
  }

  changePosition(e): void {
    if (e) {
      this.center.lng = e.lng;
      this.center.lat = e.lat;
    }
  }

  async searchSelectedMapData(e: AssetsData): Promise<void> {
    try {
      this.isLoading = true;
      this.layersDataNames.siteName = null;
      this.layersDataNames.areaName = null;
      this.layersDataNames.zoneName = null;
      if (+e.siteId === -1 && +e.areaId === -1 && +e.zoneId === -1) {
        this._setDataMap(this.zoneList, this.layersDataNames);
        this._setData(this.zoneList, this.layersDataNames);
        return;
      }
      if (!this.loadingOneTime) {
        this.layersSites = await this.layerService.getLayers(LayerCategory.Site).pipe(map((x: any) => x.data)).toPromise();
        this.layersAreas = await this.layerService.getLayers(LayerCategory.Area).pipe(map((x: any) => x.data)).toPromise();
        this.layersZones = await this.layerService.getLayers(LayerCategory.Zone).pipe(map((x: any) => x.data)).toPromise();
        this.loadingOneTime = true;
      }
      if (+e.siteId && +e.siteId !== -1) {
        this.layersSites.map((item) => {
          if (item.id === +e.siteId) {
            this.layersDataNames.siteName = item.name;
          }
        });
      }
      if (+e.areaId && +e.areaId !== -1) {
        this.layersAreas.map((item) => {
          if (item.id === +e.areaId) {
            this.layersDataNames.areaName = item.name;
          }
        });
      }
      if (+e.zoneId && +e.zoneId !== -1) {
        this.layersZones.map((item) => {
          if (item.id === +e.zoneId) {
            this.layersDataNames.zoneName = item.name;
          }
        });
      }
      this._setDataMap(this.zoneList, this.layersDataNames);
      this._setData(this.zoneList, this.layersDataNames);
    } catch (e) {
    } finally {
      setTimeout(() => {
        this.showHideMap = false;
        this.isLoading = false;
        this.currentView = View.ListView;
        if (this.dataClusterMap.length === 0) {
        //  this.toastr.warning(`Data for Zones ${this.layersDataNames.siteName} not found`);
        }
      }, 200);
    }
  }

  private _setData(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
      this.zoneListUI.data = [];
      dataMap.data.map((item) => {
        if (item.siteValue === searchWords.siteName) {
          this.zoneListUI.data.push(item);
        }
      });
      this.zoneListUI.totalCount = this.zoneListUI.data.length;
    }
    if (searchWords.areaName) {
      this.zoneListUI.data = [];
      dataMap.data.map((item) => {
        if (item.areaValue === searchWords.areaName) {
          this.zoneListUI.data.push(item);
        }
      });
      this.zoneListUI.totalCount = this.zoneListUI.data.length;
    }
    if (searchWords.zoneName) {
      this.zoneListUI.data = [];
      dataMap.data.map((item) => {
        if (item.name === searchWords.zoneName) {
          this.zoneListUI.data.push(item);
        }
      });
      this.zoneListUI.totalCount = this.zoneListUI.data.length;
    }
    if (!searchWords.siteName && !searchWords.areaName && !searchWords.zoneName) {
      this.zoneListUI.data = [];
      dataMap.data.map((item) => {
        this.zoneListUI.data.push(item);
      });
      this.zoneListUI.totalCount = this.zoneListUI.data.length;
    }
  }

  private _setDataMap(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.areaName) {
      this.dataClusterMap = [];
      dataMap.data.map((item) => {
        this._setDataClusterMap(item, searchWords, dataMap.totalCount);
      });
    } else {
      this.dataClusterMap = [];
      dataMap.data.map((item, index) => {
        this.dataClusterMap[index] = {
          lat: item.metaData.address.latitude,
          long: item.metaData.address.longitude,
          site: item.parent.parent.name,
          area: item.parent.name,
          zone: item.name,
          sourceName: item.name,
          siteId: item.siteId,
          total: dataMap.totalCount
        };
      });
    }
  }

  private _setDataClusterMap(item, searchWords: ILayersDataNames, totalCount): void {
    if (item.parentName === searchWords.areaName && searchWords.zoneName === null) {
      this.dataClusterMap.push({
        lat: item.metaData.address.latitude,
        long: item.metaData.address.longitude,
        site: item.parent.parent.name,
        area: item.parent.name,
        zone: item.name,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    } else if (item.parentName === searchWords.areaName && item.name === searchWords.zoneName) {
      this.dataClusterMap.push({
        lat: item.metaData.address.latitude,
        long: item.metaData.address.longitude,
        site: item.parent.parent.name,
        area: item.parent.name,
        zone: item.name,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    }
  }
}
