import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ReportType } from '@one-core/model';
import { ApiService } from '../interceptors/api.service';
import { Observable } from 'rxjs';

export interface IGetReportEnterExitDataRow {
  count: number;
  name: string;
}

export interface IGetReportEnterExitData {
  row: Array<IGetReportEnterExitDataRow>;
}

export interface IGetReportEnterExitHeaders {
  name: string;
  visible: boolean;
}

export interface IGetReportEnterExit {
  data: Array<IGetReportEnterExitData>;
  headers: Array<IGetReportEnterExitHeaders>;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ApiService {

  getReport(type: ReportType, filter: string, isSchema?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('code', this.readApiReportCode)
      .set('tenantKey', this.tenantKey)
      .set('type', `${type}`)
      // .set('count', '10')
      .set('$filter', `${filter}`);
    if (isSchema) {
      params = params.set('schema', 'dbo');
    }
    return this.http.get(ApiService.readApiUrl('reports'), {params});
  }

  getReportNotCount(type: ReportType, start: string, end: string, isSchema?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('code', this.readApiReportCode)
      .set('tenantKey', this.tenantKey)
      .set('type', `${type}`)
      .set('count', `10`)
      .set('start', start)
      .set('end', end);
    if (isSchema) {
      params = params.set('schema', 'dbo');
    }
    return this.http.get(ApiService.readApiUrl('reports'), {params});
  }

  getReportMetadata(type: ReportType, start: string, end: string, metaDataKey: string, isSchema?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('code', this.readApiReportCode)
      .set('tenantKey', this.tenantKey)
      .set('type', `${type}`)
      .set('start', start)
      .set('end', end)
      .set('metaDataKey', `${metaDataKey}`);
    if (isSchema) {
      params = params.set('schema', 'dbo');
    }
    return this.http.get(ApiService.readApiUrl('reports'), {params});
  }

  getReportGroupBy(type: ReportType, groupBy: string, filter: string, isSchema?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('code', this.readApiReportCode)
      .set('tenantKey', this.tenantKey)
      .set('type', `${type}`)
      .set('groupBy', `${groupBy}`)
      .set('$filter', `${filter}`);
    if (isSchema) {
      params = params.set('schema', 'dbo');
    }
    return this.http.get(ApiService.readApiUrl('reports'), {params});
  }

  getReportEnterExit(type: ReportType, start: string, end: string, isSchema?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('code', this.readApiReportCode)
      .set('tenantKey', this.tenantKey)
      .set('type', `${type}`)
      .set('start', start)
      .set('end', end)
      .set('groupBy', 'Name');
    if (isSchema) {
      params = params.set('schema', 'dbo');
    }
    return this.http.get<any>(ApiService.readApiUrl('reports'), {params});
  }
}
