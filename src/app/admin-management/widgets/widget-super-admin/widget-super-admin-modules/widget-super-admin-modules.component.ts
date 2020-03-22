import { Component, OnInit, ViewChild } from '@angular/core';
// One - Services
import { Angular2CsvComponent } from 'angular2-csv';
import { LayerService } from '@one-core/service/layer.service';
import { ToastrService } from '../../../services/toastr.service';
import { SourceService } from '@one-core/service/source.service';
import { UserRole } from '../../../../core/models/authentication';
import { FeatureFlagService, IGetRefreshFeature } from '@one-core/service/feature-flag.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { settings } from './settings';

export enum View {
  MapView = 'map-view',
  ListView = 'list-view'
}

@Component({
  selector: 'one-admin-widget-super-admin-modules',
  templateUrl: './widget-super-admin-modules.component.html',
  styleUrls: ['./widget-super-admin-modules.component.scss']
})
export class WidgetSuperAdminModulesComponent implements OnInit {

  @ViewChild(Angular2CsvComponent, {static: true}) csv: Angular2CsvComponent;

  UserRole = UserRole;
  info: Array<TableInfo> = [
    {label: 'Module', name: 'name', width: '100%', isLink: false},
    {label: 'Toggle', name: 'value', width: '8%', isLink: false, isValue: true},
    {label: '', name: '', width: '3%', isLink: false},
  ];

  isLoading = false;
  modulesList: IGetRefreshFeature = {data: [], totalCount: 0};

  constructor(
    private layerService: LayerService,
    private toastr: ToastrService,
    private sourceService: SourceService,
    private featureFlagService: FeatureFlagService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const res = await this.featureFlagService.getRefreshFeature().toPromise();
      const data = res.data.filter(x => {
        return Boolean(settings.find(i => i.name === x.name));
      });
      this.featureFlagService.settings = data.filter(x => {
        return Boolean(x.value === true);
      });
      this.featureFlagService.settingsChanged$.next(this.featureFlagService.settings);
      settings.forEach(item => {
        const exists = data.find(x => x.name === item.name);
        if (!exists) {
          data.push(item);
        }
      });
      this.modulesList.data = data;
      this.modulesList.totalCount = data.length;
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  async toggleSwitchFeature(e): Promise<void> {
    try {
      if (e.data.id === -1) {
        const res: any = await this.featureFlagService.createSettingEntry({...e.data, value: !e.isEnabled}).toPromise();
        const index = this.modulesList.data.findIndex(x => x.name === e.data.name);
        if (index >= 0) {
          this.modulesList.data[index].id = res.id;
        }
      } else {
        e.data.value = !e.isEnabled;
        await this.featureFlagService.setRefreshFeature(e.data.id, !e.isEnabled).toPromise();
      }
      this.featureFlagService.settings = this.modulesList.data.filter(x => x.value === true);
      this.featureFlagService.settingsChanged$.next(this.featureFlagService.settings);
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
