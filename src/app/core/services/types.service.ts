import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { Observable } from 'rxjs';

export interface IType {
  id?: number;
  value?: string;
  name?: string;
  isDeleted?: boolean;
  category?: string;
  iconUrl?: string;
  tenantKey?: string;
  imageId?: string;
}

export interface TypeList {
  data: Array<IType>;
  totalCount: number;
}

export enum TypeCategory {
  Zone = 'Zone',
  Area = 'Area',
  Site = 'Site',
  Input = 'Input',
  Company = 'Company',
  Group = 'Group',
  CompanyTypes = 'companyTypes',
  Condition = 'condition',
  People = 'People',
  Operators = 'Operators',
  PeopleSources = 'peopleSources',
  Reasons = 'Reasons',
  Resolved = 'Resolved',
  Identifier = 'Identifier',
  IdentifierSources = 'identifierSources',
  Sources = 'Sources'
}

@Injectable({
  providedIn: 'root'
})
export class TypesService extends ApiService {

  lookupTypes(type: string) {
    return this.http.get(ApiService.baseApiUrl(`lookups/${type}`));
  }

  getTypes(type: string, pageNumber = 1): Observable<TypeList> {
    return this.http.get<TypeList>(ApiService.baseApiUrl('types'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('OrderBy', 'value')
        .set('filterBy', `category eq '${type}'`)
    });
  }

  getChildrenTypes(typeId: number): Observable<any> {
    return this.http.get<any>(ApiService.baseApiUrl(`types/${typeId}/children`));
  }

  getTypesForResolved(type: string, pageNumber = 1): Observable<TypeList> {
    return this.http.get<TypeList>(ApiService.baseApiUrl('types'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('OrderBy', 'value')
        .set('filterBy', `category eq '${type}' and tenantKey eq '${this.tenantKey}'`)
    });
  }

  createType(org: IType) {
    org.tenantKey = this.tenantKey;
    return this.http.post(ApiService.baseApiUrl('types'), org);
  }

  editType(url: string, type: IType) {
    const id = type.id;
    delete type.id;
    delete type.category;
    delete type.isDeleted;
    return this.http.patch(ApiService.baseApiUrl(`types/${id}`), [
      {from: 'intelico', op: 'replace', path: '/Value', value: type.value}
    ]);
  }

  removeType(url, id: number) {
    return this.http.delete(ApiService.baseApiUrl(`types/${id}`));
  }

}
