import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// One - Services
import { flyIn } from '@one-animation/flyIn.animation';
import { AddStep } from './widget-admin-assets.enum';
import { ToastrService } from '../../services/toastr.service';
import { Asset, Assets, AssetsService } from '@one-core/service/assets.service';
import { WidgetAssetsStateService } from './services/widget-assets-state.service';
// One - Components
import { SidebarWindowComponent } from '@one-common/window/sidebar-window/sidebar-window.component';
import { ActivityFilterComponent } from '../widget-activity/activity-filter/activity-filter.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';
import { ActivityTableComponent } from '../widget-activity/activity-table/activity-table.component';
import { ActivityMapComponent } from '../widget-activity/activity-map/activity-map.component';
import { Subscription } from 'rxjs';
import { IType, TypesService } from '@one-core/service/types.service';
import { ClusterMapItem, LayerCategory } from '@one-core/model';
import { LayerService } from '@one-core/service/layer.service';
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { map } from 'rxjs/operators';
import { ILayersDataNames } from '../widget-admin/widget-admin-source/widget-admin-source.component';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view'
}

@Component({
  selector: 'one-admin-widget-assets',
  templateUrl: './widget-assets.component.html',
  styleUrls: ['./widget-assets.component.scss'],
  animations: [
    flyIn(300, 330, true)
  ]
})
export class WidgetAssetsComponent implements OnInit, OnDestroy {

  @ViewChild(SidebarWindowComponent, {static: true}) sidebarWindowRef: SidebarWindowComponent;
  @ViewChild(ActivityFilterComponent, {static: true}) filterRef: ActivityFilterComponent;
  @ViewChild(SearchKeyFilterComponent, {static: true}) searchKeyFilterRef: SearchKeyFilterComponent;
  @ViewChild(ActivityTableComponent, {static: true}) tableRef: ActivityTableComponent;
  @ViewChild(ActivityMapComponent, {static: true}) mapRef: ActivityMapComponent;

  View = View;
  currentView: View = View.ListView;
  currentStep = AddStep.Default;
  enum_addStep = AddStep;

  isLoading = false;
  isAddModal: boolean;
  showConfirmModal: boolean;
  initialLoading = true;
  searchKeyFilter = '';
  sideBarFilter = '';
  dataForMap: ClusterMapItem[] = [{lat: null, long: null, site: '', area: '', zone: '', total: null, siteId: null}];
  assets: Assets = {data: [], totalCount: 0};
  assetsUI: Assets = {data: [], totalCount: 0};
  asset: Asset;
  currentPage = 1;
  totalCount = 0;
  newAssetsCount = 0;
  showAddModal = false;
  loadingOneTime: boolean;
  selectedAsset: Asset;
  layersSites: Array<any>;
  layersAreas: Array<any>;
  layersZones: Array<any>;
  typesAssets: Array<IType> = [];
  sites: Array<any> = [];
  areas: Array<any> = [];
  zones: Array<any> = [];
  layersDataNames: ILayersDataNames = {siteName: null, areaName: null, zoneName: null};
  subscriptionNextStep: Subscription;

  constructor(
    public assetsService: AssetsService,
    public typesService: TypesService,
    public layerService: LayerService,
    public widgetAssetsStateService: WidgetAssetsStateService,
    private toastr: ToastrService
  ) {
    this.layerService.getLayers(LayerCategory.Site).toPromise()
      .then(
        layers => {
          this.sites = layers.data;
        }
      );
    this.layerService.getLayers(LayerCategory.Area).toPromise()
      .then(
        areas => {
          this.areas = areas.data;
        }
      );
    this.layerService.getLayers(LayerCategory.Zone).toPromise()
      .then(
        zones => {
          this.zones = zones.data;
        }
      );
    this.typesService.getTypes('Assets').toPromise()
      .then(
        typesAssets => {
          if (typesAssets) {
            this.typesAssets = typesAssets.data;
          }
        }, err => console.error(err)
      );
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptionNextStep = this.widgetAssetsStateService.countSteps$.subscribe(
      countStep => {
        if (countStep === 1) {
          this.currentStep = this.enum_addStep.Details;
        }
        if (countStep === 2) {
          this.currentStep = this.enum_addStep.Location;
        }
      }
    );
    setTimeout(() => {
      this.getAssets();
    }, 300);
  }

  async getAssets(): Promise<void> {
    try {
      this.isLoading = true;
      this.assets = await this.assetsService.getAssets().toPromise();
      if (this.assets.data.length) {
        setTimeout(() => {
          this._setDataAssets(this.assets);
          this._setDataMap(this.assets, this.layersDataNames);
        }, 500);
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionNextStep.unsubscribe();
  }

  async searchSelectedMapData(e: AssetsData): Promise<void> {
    try {
      this.isLoading = true;
      this.layersDataNames.siteName = null;
      this.layersDataNames.areaName = null;
      this.layersDataNames.zoneName = null;
      if (+e.siteId === -1 && +e.areaId === -1 && +e.zoneId === -1) {
        this._setDataMap(this.assets, this.layersDataNames);
        this._setData(this.assets, this.layersDataNames);
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
      this._setDataMap(this.assets, this.layersDataNames);
      this._setData(this.assets, this.layersDataNames);
    } catch (e) {
    } finally {
      setTimeout(() => {
        this.isLoading = false;
        this.currentView = View.ListView;
        if (this.dataForMap.length === 0) {
          this.toastr.warning(`Data for Assets ${this.layersDataNames.siteName} not found`);
        }
      }, 200);
    }
  }

  completeAsset(e): void {
    if (e) {
      this.getAssets();
      this.showAddModal = false;
    }
  }

  toggleCurrentView(view: View): void {
    this.currentView = view;
    this.newAssetsCount = 0;
    if (this.currentView === View.ListView) {
      this.currentPage = 1;
      // this.search$.next();
    }
  }

  nextStep(e): void {
    if (e) {
      this.currentStep = this.enum_addStep.Location;
    }
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.isAddModal = true;
    this.currentStep = this.enum_addStep.Details;
    this.widgetAssetsStateService.updateAsset(
      this.asset = {
        name: '',
        imageUrl: '',
        latitude: 51.5074,
        longitude: 0.1278,
        groupId: '',
        sourceId: null,
        typeId: null,
        siteId: -1,
        areaId: -1,
        zoneId: -1,
        tenantKey: ''
      }
    );
  }

  onClosePanel(): void {
    this.showAddModal = false;
  }

  deleteAsset(e): void {
    this.selectedAsset = e;
    this.showConfirmModal = true;
  }

  editAsset(e): void {
    this.assetsService.getAsset(e.id)
      .subscribe(
        asset => {
          this.assetsService.getImageAsset(e.id)
            .subscribe(
              image => {
                if (image.length > 0) {
                  asset.item.imageId = image[0].id;
                  asset.item.imageUrl = image[0].fileUrl;
                }
              }, err => console.error(err)
            );
          this.widgetAssetsStateService.updateAsset(asset.item);
          this.widgetAssetsStateService.updateCountSteps(1);
          this.isAddModal = false;
          this.showAddModal = true;
        }, err => console.error(err)
      );
  }

  async onDelete(flag): Promise<void> {
    if (flag) {
      try {
        this.isLoading = true;
        await this.assetsService.removeAsset(this.selectedAsset.id).toPromise();
        await this.assetsService.getImageAsset(this.selectedAsset.id)
          .subscribe(
            image => {
              if (image.length > 0) {
                this.assetsService.deleteImageAsset(image[0].id).toPromise();
              }
            }, err => console.error(err)
          );
        await this.getAssets();
      } catch (e) {
        this.toastr.error(null, e);
      } finally {
        this.showConfirmModal = false;
        this.isLoading = false;
      }
    } else {
      this.selectedAsset = null;
      this.showConfirmModal = false;
    }
  }

  changeSearchKeyFilter(filters): void {
    this.searchKeyFilter = filters;
    // this.search$.next();
  }

  changeFilter(filters): void {
    if (this.initialLoading) {
      this.sideBarFilter = filters;
      //   this.search$.next();
      if (this.mapRef) {
        this.mapRef.filterChanged(this.sideBarFilter, this.searchKeyFilter);
      }
      this.initialLoading = false;
    }
  }

  clearSideBar(e): void {
    if (e) {
      this.sideBarFilter = '';
      this.getAssets();
    }
  }

  viewNewItems(): void {

  }

  private _setDataAssets(assets: Assets): void {
    this.assetsUI.data = [];
    assets.data.map((item) => {
      this.assetsUI.data.push(item);
    });
    this.assetsUI.totalCount = this.assetsUI.data.length;
    this.assetsUI.data.map((item) => {
      this.typesAssets.map((itm) => {
        if (item.typeId === itm.id) {
          item.typeId = itm.value;
        }
      });
      this.areas.map((itm) => {
        if (item.areaId === itm.id) {
          item.areaId = itm.name;
        }
      });
      this.zones.map((itm) => {
        if (item.zoneId === itm.id) {
          item.zoneId = itm.name;
        }
      });
      this.sites.map((itm) => {
        if (item.siteId === itm.id) {
          item.siteId = itm.name;
        }
      });
    });
  }

  private _setData(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
      this.assetsUI.data = [];
      dataMap.data.map((item) => {
        if (item.siteId === searchWords.siteName) {
          this.assetsUI.data.push(item);
        }
      });
      this.assetsUI.totalCount = this.assetsUI.data.length;
    } else {
      this.assetsUI.data = [];
      dataMap.data.map((item) => {
        this.assetsUI.data.push(item);
      });
      this.assetsUI.totalCount = this.assetsUI.data.length;
    }
  }

  private _setDataMap(dataMap: any, searchWords: ILayersDataNames): void {
    if (searchWords.siteName) {
      this.dataForMap = [];
      dataMap.data.map((item) => {
        this._setDataClusterMap(item, searchWords, dataMap.totalCount);
      });
    } else {
      this.dataForMap = [];
      dataMap.data.map((item, index) => {
        this.dataForMap[index] = {
          lat: item.latitude,
          long: item.longitude,
          site: item.siteId,
          area: item.areaId,
          zone: item.zoneId,
          sourceName: item.name,
          siteId: item.siteId,
          total: dataMap.totalCount
        };
      });
    }
  }

  private _setDataClusterMap(item, searchWords: ILayersDataNames, totalCount): void {
    if (item.siteId === searchWords.siteName && searchWords.areaName === null && searchWords.zoneName === null) {
      this.dataForMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteId,
        area: item.areaId,
        zone: item.zoneId,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    } else if (item.siteId === searchWords.siteName && item.areaId === searchWords.areaName && searchWords.zoneName === null) {
      this.dataForMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteId,
        area: item.areaId,
        zone: item.zoneId,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    } else if (item.siteId === searchWords.siteName && item.areaId === searchWords.areaName && item.zoneId === searchWords.zoneName) {
      this.dataForMap.push({
        lat: item.latitude,
        long: item.longitude,
        site: item.siteId,
        area: item.areaId,
        zone: item.zoneId,
        sourceName: item.name,
        siteId: item.siteId,
        total: totalCount
      });
    }
  }
}
