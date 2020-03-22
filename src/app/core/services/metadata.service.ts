import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { Observable } from 'rxjs';
import { IMetaDataUI } from '../../admin-management/widgets/widget-actions/services/action-state.service';

export interface IGetMetadataKeys {
  data: Array<IMetaDataUI>;
  totalCount: number;
}

export interface IGetMetadataValuesDataType {
  category: number;
  id: number;
  tenantKey: string;
  value: string;
}

export interface IGetMetadataValuesData {
  id: number;
  metadataKey: IMetaDataUI;
  type: IGetMetadataValuesDataType;
  value: string;
}

export interface IGetMetadataValues {
  data: Array<IGetMetadataValuesData>;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService extends ApiService {

  getMetadataKeys(identifierTypeId: number): Observable<IGetMetadataKeys> {
    const params = new HttpParams()
      .set('filterBy', `parentTypeId eq ${identifierTypeId}`)
      .set('recordCount', `9999`);
    return this.http.get<IGetMetadataKeys>(ApiService.baseApiUrl('metadata-keys'), {params});
  }

  getMetadataValues(filterBy: string): Observable<IGetMetadataValues> {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('tenantKey', `${this.tenantKey}`)
      .set('filterBy', `metadataKey.value eq '${filterBy}'`);
    return this.http.get<IGetMetadataValues>(ApiService.baseApiUrl(`metadata-values`), {params});
  }
}
