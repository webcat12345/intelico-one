import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';

export interface IIdentifier {
  id: number;
  name: string;
  value: string;
  typeId: number;
  typeName?: string;
  identifierSourceId?: number;
}

export interface IIdentifierList {
  totalCount: number;
  data: IIdentifier[];
}

@Injectable({
  providedIn: 'root'
})
export class IdentifierService extends ApiService {

  getIdentifiers() {
    return this.http.get(ApiService.baseApiUrl('identifiers'), {
      params: new HttpParams()
        .set('tenantKey', this.tenantKey)
        .set('pageNumber', '0')
        .set('RecordCount', '100')
    });
  }

  getIdentifierById(id) {
    return this.http.get(ApiService.baseApiUrl(`identifiers/${id}/${this.tenantKey}`));
  }

  searchIdentifier(name) {
    return this.http.get(ApiService.baseApiUrl('identifiers'), {
      params: new HttpParams()
        .set('tenantKey', this.tenantKey)
        .set('filterBy', `name eq "${name}"`)
        .set('pageNumber', '0')
        .set('RecordCount', '100')
    });
  }
}
