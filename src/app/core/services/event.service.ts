import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventDetail, EventListItem, Pagination } from '../models';
import { ApiService } from '../interceptors/api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {

  getEventById(id: string): Observable<EventDetail> {
    const params = new HttpParams()
      .set('code', this.readApiDetailCode);
    return this.http.get<EventDetail>(ApiService.readApiUrl(`events/${id}`), {params});
  }

  searchEventByIdentifier(identifier: string, filterString: string, currentPage = 1, itemPerPage = 10): Observable<Pagination<EventListItem>> {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$skip', `${(currentPage - 1) * itemPerPage}`)
      .set('$top', `${itemPerPage}`)
      .set('$orderby', `createdAt desc`)
      // .set('$filter', `historyItemType eq 1 and historyItemSource ne ${IdentifierType.Video}` + ` and tenantKey eq '${this.tenantKey}'` + ` and (contains(identifier, '${identifier}'))${filterString ? ' and ' + filterString : ''}`)
      .set('$filter', `tenantKey eq '${this.tenantKey}'` + ` and identifier eq '${identifier}'${filterString ? ' and ' + filterString : ''}`)
      .set('$count', `false`);
    return this.http.get(ApiService.readApiUrl('history'), {params}).pipe(
      map((res: Pagination<EventListItem>) => res)
    );
  }

  searchPlate(keyword, identifierType, filterString: string) {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('field', 'identifier')
      .set('value', keyword)
      .set('secondField', 'historyItemSource')
      .set('secondValue', identifierType)
      .set('$filter', `tenantKey eq '${this.tenantKey}'` + ` and identifier eq '${identifierType}'${filterString ? ' and ' + filterString : ''}`)
      .set('tenantKey', this.tenantKey)
      .set('$count', 'false');
    return this.http.get(ApiService.readApiUrl('lookup/history'), {params});
  }

}
