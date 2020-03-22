import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from '../interceptors/api.service';

export interface IWebhooks {
  id: number;
  tenantKey: string;
  typeId: number;
  name: string;
  url: string;
  fieldFirstName?: string;
  fieldMetaDataFirstName?: string;
  fieldMetaDataLocation?: string;
}

export interface IWebhooksList {
  data: IWebhooks[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebhooksService extends ApiService {

  getWebhooks(pageNumber = 1): Observable<IWebhooksList> {
    return this.http.get<IWebhooksList>(ApiService.baseApiUrl('webhooks'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('filterBy', `tenantKey eq '${this.tenantKey}'`)
    });
  }

  createWebhooks(webhooks: IWebhooks) {
    const payload = {
      name: webhooks.name,
      url: webhooks.url,
      tenantKey: this.tenantKey,
      typeId: webhooks.typeId
    };
    return this.http.post(ApiService.baseApiUrl('webhooks'), payload);
  }

  editWebhooks(webhooks: IWebhooks) {
    const payload = [
      {
        operation: 'replace',
        path: '/name',
        value: webhooks.name
      },
      {
        operation: 'replace',
        path: '/url',
        value: webhooks.url
      },
      {
        operation: 'replace',
        path: '/typeId',
        value: webhooks.typeId
      }
    ];
    return this.http.patch(ApiService.baseApiUrl(`webhooks/${webhooks.id}`), payload);
  }

  removeWebhooks(id) {
    return this.http.delete(ApiService.baseApiUrl(`webhooks/${id}`));
  }

}
