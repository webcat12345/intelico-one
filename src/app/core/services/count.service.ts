import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';
import { EventListItem, Pagination } from '@one-core/model';

@Injectable({
  providedIn: 'root'
})
export class CountService extends ApiService {

  getCountHistory(filter) {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$filter', `tenantKey eq '${this.tenantKey}' and ${filter}`);
    return this.http.get(ApiService.readApiUrl('count/history'), {params}).pipe(
      map((res: Pagination<EventListItem>) => res)
    );
  }

  getCountTasks(filter) {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$filter', `tenantKey eq '${this.tenantKey}' and ${filter}`);
    return this.http.get(ApiService.readApiUrl('count/tasks'), {params}).pipe(
      map((res: Pagination<EventListItem>) => res)
    );
  }
}
