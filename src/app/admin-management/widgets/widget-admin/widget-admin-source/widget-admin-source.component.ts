import { Component, OnInit, ViewChild } from '@angular/core';
// One - Services
import { Angular2CsvComponent } from 'angular2-csv';
import { flyIn } from '@one-animation/flyIn.animation';
import { catchError, finalize, map } from 'rxjs/operators';
import { LayerService } from '@one-core/service/layer.service';
import { ClusterMapItem, LayerCategory } from '@one-core/model';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { ICenter } from '../widget-admin-zone/widget-admin-zone.component';
import { IGetSourceList, SourceService } from '@one-core/service/source.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view'
}

export interface ILayersDataNames {
  siteName: string;
  areaName: string;
  zoneName: string;
}

@Component({
  selector: 'one-admin-widget-admin-source',
  templateUrl: './widget-admin-source.component.html',
  styleUrls: ['./widget-admin-source.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetAdminSourceComponent implements OnInit {

  @ViewChild(Angular2CsvComponent, {static: false}) csv: Angular2CsvComponent;

  UserRole = UserRole;
  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '20%', isLink: false},
    {label: 'Description', name: 'description', width: '', isLink: false},
    {label: 'Type', name: 'identifierTypeName', width: '150px', isLink: false},
    {label: 'Condition', name: 'typeName', width: '80px', isLink: false},
    {label: 'Zone', name: 'zoneName', width: '13%', isLink: false},
    {label: 'Toggle', name: 'isEnableD', width: '8%', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  center: ICenter = {lat: 51.5074, lng: 0.1278};
  dataClusterMap: ClusterMapItem[] = [{lat: 12, long: 12, site: '', siteId: 12, total: 12}];
  showAddModal = false;
  showHideMap = false;
  showConfirmModal = false;
  isLoading = false;
  isAddModal = false;
  loadingOneTime: boolean;
  searchKey = '';
  sideBarFilter: string;
  searchKeyFilter = '';
  layersDataNames: ILayersDataNames = {siteName: null, areaName: null, zoneName: null};
  layersSites: Array<any>;
  layersAreas: Array<any>;
  layersZones: Array<any>;
  selectedSource: any = null;
  sourceList: IGetSourceList = {data: [], totalCount: 0};
  sourceListUI: IGetSourceList = {data: [], totalCount: 0};
  currentView: View = View.ListView;
  View = View;

  constructor(
    private layerService: LayerService,
    private toastr: ToastrService,
    private sourceService: SourceService
  ) {
  }

  ngOnInit(): void {
    this.getSources();
  }

  getSources(): void {
    this.sourceList.data = [];
    this.sourceList.totalCount = null;
    this.isLoading = true;
    this.sourceService.getSources()
      .pipe(
        finalize(() => this.isLoading = false),
        catchError(err => {
          this.toastr.error(null, err);
          throw err;
        }),
        map((res: any) => {
          res.data.map(x => {
            x.zoneName = x.zone.name;
            x.areaName = x.zone.parent.name;
            x.siteName = x.zone.parent.parent.name;
            x.typeName = x.type.value;
            x.identifierTypeName = x.identifierType ? x.identifierType.value : '';
            return x;
          });
          return res;
        })
      ).toPromise().then(res => {
      this._setDataMap(res, this.layersDataNames);
      res.data.map((item) => {
        this.sourceList.data.push(item);
      });
      this.sourceList.totalCount = res.totalCount;
      this._setData(this.sourceList, this.layersDataNames);
    });
  }

  toggleCurrentView(view: View): void {
    this.currentView = view;
    //  this.newAssetsCount = 0;
    if (this.currentView === View.ListView) {
      this.showHideMap = false;
      //    this.currentPage = 1;
      // this.search$.next();
    }
    if (this.currentView === View.MapView) {
      this.showHideMap = true;
    }
  }

  onCreateSource(): void {
    this.isAddModal = true;
    this.selectedSource = null;
    this.showAddModal = true;
  }

  onEditSource(e): void {
    this.isAddModal = false;
    this.selectedSource = e;
    this.showAddModal = true;
  }

  onDeleteConfirm(e): void {
    this.showConfirmModal = true;
    this.selectedSource = e;
  }

  async toggleSwitch(e): Promise<void> {
    try {
      await this.sourceService.editIsEnabled(e.data.id, e.isEnabled).toPromise();
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async onRemoveSource(flag) {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedSource = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.sourceService.removeSource(this.selectedSource.id).toPromise();
      await this.getSources();
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.showConfirmModal = false;
      this.selectedSource = null;
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getSources();
    }
    this.showAddModal = false;
  }

  onExport(): void {
    this.csv.onDownload();
  }

  changePosition(e): void {
    if (e) {
      this.center.lng = e.lng;
      this.center.lat = e.lat;
    }
  }

  changeFilter(filters): void {
    this.sideBarFilter = filters;
  }

  async searchSelectedMapData(e: AssetsData): Promise<void> {
    try {
      this.isLoading = true;
      // this.showHideMap = false;
      this.layersDataNames.siteName = null;
      this.layersDataNames.areaName = null;
      this.layersDataNames.zoneName = null;
      if (+e.siteId === -1 && +e.areaId === -1 && +e.zoneId === -1) {
        this._setDataMap(this.sourceList, this.layersDataNames);
        this._setData(this.sourceList, this.layersDataNames);
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
      } else if (+e.areaId && +e.areaId !== -1) {
        this.layersAreas.map((item) => {
          if (item.id === +e.areaId) {
            this.layersDataNames.areaName = item.name;
          }
        });
      } else if (+e.zoneId && +e.zoneId !== -1) {
        this.layersZones.map((item) => {
          if (item.id === +e.zoneId) {
            this.layersDataNames.zoneName = item.name;
          }
        });
      }
      this._setDataMap(this.sourceList, this.layersDataNames);
      this._setData(this.sourceList, this.layersDataNames);
    } catch (e) {
    } finally {
      setTimeout(() => {
        this.isLoading = false;
        this.currentView = View.ListView;
        this.showHideMap = false;
        if (this.dataClusterMap.length === 0) {
          this.toastr.warning(`Data for Sources ${this.layersDataNames.siteName} not found`);
        }
      }, 200);
    }
  }

  private _setData(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
      this.sourceListUI.data = [];
      dataMap.data.map((item) => {
        if (item.siteName === searchWords.siteName) {
          this.sourceListUI.data.push(item);
        }
      });
      this.sourceListUI.totalCount = this.sourceListUI.data.length;
    } else {
      this.sourceListUI.data = [];
      dataMap.data.map((item) => {
        this.sourceListUI.data.push(item);
      });
      this.sourceListUI.totalCount = this.sourceListUI.data.length;
    }
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
          lat: item.latitude,
          long: item.longitude,
          site: item.siteName,
          area: item.areaName,
          zone: item.zoneName,
          sourceName: item.name,
          siteId: item.siteId,
          total: dataMap.totalCount
        };
      });
    }
  }

  private _setDataClusterMap(item, searchWords: ILayersDataNames, totalCount): void {
    if (item.siteName === searchWords.siteName && searchWords.areaName === null && searchWords.zoneName === null) {
      this.dataClusterMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteName,
        area: item.areaName,
        zone: item.zoneName,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    } else if (item.siteName === searchWords.siteName && item.areaName === searchWords.areaName && searchWords.zoneName === null) {
      this.dataClusterMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteName,
        area: item.areaName,
        zone: item.zoneName,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    } else if (item.siteName === searchWords.siteName && item.areaName === searchWords.areaName && item.zoneName === searchWords.zoneName) {
      this.dataClusterMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteName,
        area: item.areaName,
        zone: item.zoneName,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    }
  }
}
