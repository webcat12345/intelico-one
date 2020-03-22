import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Pagination } from '@one-core/model';
import { ApiService } from '../interceptors/api.service';

export interface IGlobalStats {
  orgId: string;
  orgName: string;
  tenantKey: string;
  activityTotal?: any;
  alertsTotal?: any;
  smsTotal?: any;
  whatsAppTotal?: any;
  phoneCallTotal?: any;
  emailTotal?: any;
}

export interface IGlobalStatsList {
  data: IGlobalStats[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalStatsService extends ApiService {

  getTenantStat(table: string, tenantKey: string, filter = '') {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$filter', `tenantKey eq '${tenantKey}' ${filter}`);
    return this.http.get(ApiService.readApiUrl(`count/${table}`), {params}).pipe(
      map((res: Pagination<any>) => res)
    );
  }
}
