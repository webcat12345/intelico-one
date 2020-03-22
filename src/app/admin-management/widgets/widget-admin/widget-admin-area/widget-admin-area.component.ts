import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { flyIn } from '@one-animation/flyIn.animation';
import { LayerService } from '@one-core/service/layer.service';
import { ClusterMapItem, LayerCategory } from '@one-core/model';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminAreaAddComponent } from './widget-admin-area-add/widget-admin-area-add.component';
import { map } from 'rxjs/operators';
import { ICenter } from '../widget-admin-zone/widget-admin-zone.component';
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { ILayersDataNames } from '../widget-admin-source/widget-admin-source.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view'
}

@Component({
  selector: 'one-admin-widget-admin-area',
  templateUrl: './widget-admin-area.component.html',
  styleUrls: ['./widget-admin-area.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminAreaComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(WidgetAdminAreaAddComponent, {static: false}) addCom: WidgetAdminAreaAddComponent;

  UserRole = UserRole;
  center: ICenter = {lat: 51.5074, lng: 0.1278};
  showAddModal = false;
  showConfirmModal = false;
  showHideMap = false;
  loadingOneTime = false;
  dataClusterMap: ClusterMapItem[] = [{lat: 12, long: 12, site: '', siteId: 12, total: 12}];
  layersDataNames: ILayersDataNames = {siteName: null, areaName: null, zoneName: null};

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '17%', isLink: false},
    {label: 'Description', name: 'description', width: '', isLink: false},
    {label: 'Type', name: 'typeValue', width: '17%', isLink: true},
    {label: 'Site', name: 'parentName', width: '17%', isLink: true},
    {label: 'Zones', name: 'childrenName', width: '17%', isLink: true},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  isAddModal = false;
  selectedArea: any = null;
  isLoading = false;
  searchKey = '';
  areaList: any = {data: [], totalCount: 0};
  areaListUI: any = {data: [], totalCount: 0};
  sites = [];
  layersSites: Array<any>;

  siteFilter = 0;
  query = '';
  currentView: View = View.ListView;
  View = View;

  constructor(
    private layerService: LayerService,
    private toastr: ToastrService
  ) {
  }

  get getCenter(): ICenter {
    return this.center;
  }

  ngOnInit(): void {
    this.isAddModal = this.isAddWindow;
    this.showAddModal = this.isAddWindow;
    this.getSites();
    if (!this.isAddWindow) {
      this.getAreas();
    }
  }

  async getSites(): Promise<void> {
    try {
      const data: any = await this.layerService.getLayers(LayerCategory.Site).toPromise();
      this.sites = data.data;
    } catch (e) {

    } finally {

    }
  }

  getAreas(): void {
    this.isLoading = true;
    this.layerService.getLayers(LayerCategory.Area, 1, this.query)
      .subscribe(
        resp => {
          this.areaList = resp;
          if (this.areaList.data.length) {
            this._setDataMap(this.areaList, this.layersDataNames);
            this._setData(this.areaList, this.layersDataNames);
          }
          this.isLoading = false;
        }, error => {
          this.toastr.error('There seems to be a problem - please try again.');
        }
      );
  }

  onChangeSiteFilter(e): void {
    this.siteFilter = e;
    if (+this.siteFilter > 0) {
      this.query = `parentId eq ${this.siteFilter}`;
    } else {
      this.query = '';
    }
    this.getAreas();
  }

  onCreateArea(): void {
    this.isAddModal = true;
    this.selectedArea = null;
    this.showAddModal = true;
    this.center = {lat: 51.5074, lng: 0.1278};
  }

  async onEditArea(e): Promise<void> {
    this.isAddModal = false;
    this.selectedArea = e;
    const res: any = await this.layerService.getLayerDetail(this.selectedArea.id).toPromise();
    this.selectedArea = res.item;
    this.center = {lat: res.item.metaData.address.latitude, lng: res.item.metaData.address.longitude};
    this.selectedArea.metaData = res.item.metaData;
    this.selectedArea.description = res.item.metaData.description;
    this.showAddModal = true;
    setTimeout(() => {
      this.addCom.areaForm.get('description').setValue(this.selectedArea.description);
      this.addCom.areaForm.get('metadata').setValue({...res.item.metaData});
    }, 100);
  }

  onDeleteConfirm(e): void {
    this.showConfirmModal = true;
    this.selectedArea = e;
  }

  async onRemoveArea(flag): Promise<void> {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedArea = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.layerService.deleteLayer(this.selectedArea.id).toPromise();
      await this.getAreas();
      this.toastr.success('Area deleted');
    } catch (e) {
      this.toastr.error('Oops, we had an issue deleting an entry.');
    } finally {
      this.showConfirmModal = false;
      this.selectedArea = null;
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getAreas();
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
        this._setDataMap(this.areaList, this.layersDataNames);
        this._setData(this.areaList, this.layersDataNames);
        return;
      }
      if (!this.loadingOneTime) {
        this.layersSites = await this.layerService.getLayers(LayerCategory.Site).pipe(map((x: any) => x.data)).toPromise();
        this.loadingOneTime = true;
      }
      if (+e.siteId && +e.siteId !== -1) {
        this.layersSites.map((item) => {
          if (item.id === +e.siteId) {
            this.layersDataNames.siteName = item.name;
          }
        });
      }
      this._setDataMap(this.areaList, this.layersDataNames);
      this._setData(this.areaList, this.layersDataNames);
    } catch (e) {
    } finally {
      setTimeout(() => {
        this.showHideMap = false;
        this.isLoading = false;
        this.currentView = View.ListView;
        if (this.dataClusterMap.length === 0) {
          this.toastr.warning(`Data for Areas ${this.layersDataNames.siteName} not found`);
        }
      }, 200);
    }
  }

  private _setData(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
      this.areaListUI.data = [];
      dataMap.data.map((item) => {
        if (item.parentName === searchWords.siteName) {
          this.areaListUI.data.push(item);
        }
      });
      this.areaListUI.totalCount = this.areaListUI.data.length;
    } else {
      this.areaListUI.data = [];
      dataMap.data.map((item) => {
        this.areaListUI.data.push(item);
      });
      this.areaListUI.totalCount = this.areaListUI.data.length;
    }
    this.areaListUI.data.map((item) => {
      item.description = item.metaData.description;
      item.typeValue = item.type.value;
      item.parentName = item.parent.name;
      if (item.children.length > 0) {
        item.childrenName = item.children.length;
      } else {
        item.childrenName = 0;
      }
    });
  }

  private _setDataMap(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
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
          site: item.parent.name,
          area: item.name,
          zone: item.zoneName,
          sourceName: item.name,
          siteId: item.siteId,
          total: dataMap.totalCount
        };
      });
    }
  }

  private _setDataClusterMap(item, searchWords: ILayersDataNames, totalCount): void {
    if (item.parentName === searchWords.siteName) {
      this.dataClusterMap.push({
        lat: item.metaData.address.latitude,
        long: item.metaData.address.longitude,
        site: item.parent.name,
        area: item.name,
        zone: item.zoneName,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    }
  }
}
