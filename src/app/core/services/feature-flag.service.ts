import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../interceptors/api.service';
import { settings } from '../../admin-management/widgets/widget-super-admin/widget-super-admin-modules/settings';
import { adminMeta, WindowMenuType } from '../../admin-management/meta/admin-meta';

export interface IGetRefreshFeatureData {
  id: number;
  name: string;
  type: string;
  value: boolean;
}

export interface IGetRefreshFeature {
  data: Array<IGetRefreshFeatureData>;
  totalCount: number;
}

interface ISetRefreshFeature {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService extends ApiService {

  settings: any[] = [];

  settingsChanged$: Subject<any[]> = new Subject<any[]>();

  getRefreshFeature(): Observable<IGetRefreshFeature> {
    return this.http.get<IGetRefreshFeature>(ApiService.baseApiUrl('settings'), {
      params: new HttpParams()
        .set('filterBy', `typeId eq 1 and tenantKey eq '${this.tenantKey}'`)
    });
  }

  setRefreshFeature(featureId: number, isEnabled: boolean): Observable<ISetRefreshFeature> {
    const body = [
      {
        op: 'replace',
        path: '/value',
        value: isEnabled
      }
    ];
    return this.http.patch<ISetRefreshFeature>(ApiService.baseApiUrl(`settings/${featureId}`), body);
  }

  createSettingEntry(setting) {
    const body = {
      dataType: 'boolean',
      name: setting.name,
      tenantKey: this.tenantKey,
      value: setting.value,
      typeId: 1
    };
    return this.http.post(ApiService.baseApiUrl(`settings`), body);
  }

  isFeatureActivated(windowType: string) {
    const match = adminMeta.find(x => x.windowType === windowType && x.menuType === WindowMenuType.Admin);
    if (!match) {
      return true; // won't reach here
    }
    const setting = settings.find(x => x.name === match.menuLabel);
    if (setting) {
      return Boolean(this.settings.find(x => x.name === setting.name));
    } else {
      return true;
    }
  }

  isFeatureNameActivated(featureName: string) {
    const setting = settings.find(x => x.name === featureName);
    if (setting) {
      return Boolean(this.settings.find(x => x.name === setting.name));
    } else {
      return true;
    }
  }
}
