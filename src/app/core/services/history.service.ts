import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';
import { EventListItem, Pagination } from '@one-core/model';

export interface IGetHistoryByEnterExitResults {
  name: string;
  total: number;
}

export interface IGetHistoryByEnterExit {
  count: number;
  results: Array<IGetHistoryByEnterExitResults>;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends ApiService {

  getHistories(filter: string, currentPage = 1, itemPerPage = 20): Observable<Pagination<EventListItem>> {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$skip', `${(currentPage - 1) * itemPerPage}`)
      .set('$top', `${itemPerPage}`)
      .set('$orderby', `createdAt desc`)
      // .set('$filter', `tenantKey eq '${this.tenantKey}'${filter} and historyItemSource ne ${IdentifierType.Video}`)
      .set('$filter', `tenantKey eq '${this.tenantKey}'${filter}`)
      .set('$count', `false`);
    return this.http.get(ApiService.readApiUrl('history'), {params}).pipe(
      map((res: Pagination<EventListItem>) => res)
    );
  }

  getHistoryBySite(filter = '') {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('by', 'siteId')
      .set('tenantKey', `${this.tenantKey}`)
      .set('fields', 'site,lat,long');
    //  .set('$filter', filter);
    return this.http.get(ApiService.readApiUrl('group/history'), {params}).pipe(
      map((res: any) => res.results.filter(x => x.siteId && x.lat && x.long))
    );
  }

  getHistoryByEnterExit(): Observable<IGetHistoryByEnterExit> {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('by', 'name')
      .set('tenantKey', `${this.tenantKey}`);
    return this.http.get<IGetHistoryByEnterExit>(ApiService.readApiUrl('group/history'), {params});
  }
}
