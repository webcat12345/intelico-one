import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
// One - Services
import { ApiService } from '../interceptors/api.service';
import { IdentifierType } from '@one-core/model';
import { Observable } from 'rxjs';

export interface IGetSourceListDataIdentifierType {
  id: number;
  value: string;
  tenantKey: string;
  category: number;
}

export interface IGetSourceListDataType {
  id: number;
  value: string;
  tenantKey: string;
  category: number;
}

export interface IGetSourceListDataZoneMetaDataAddress {
  city: string;
  country: string;
  county: string;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  postCode: string;
}

export interface IGetSourceListDataZoneMetaData {
  address: IGetSourceListDataZoneMetaDataAddress;
  description: string;
}

export interface IGetSourceListDataZone {
  category: number;
  children: string;
  id: number;
  isDeleted: boolean;
  metaData: IGetSourceListDataZoneMetaData;
  name: string;
  parent: IGetSourceListDataZone;
  parentId: number;
  tenantKey: string;
  type: string;
  typeId: number;
}

export interface IGetSourceListData {
  areaName: string;
  createdDate: string;
  description: string;
  id: number;
  identifierType: IGetSourceListDataIdentifierType;
  identifierTypeId: number;
  identifierTypeName: string;
  isDeleted: boolean;
  isEnabled: boolean;
  key: string;
  latitude: number;
  longitude: number;
  modifiedDate: string;
  name: string;
  siteName: string;
  tenantKey: string;
  type: IGetSourceListDataType;
  typeId: number;
  typeName: string;
  zone: IGetSourceListDataZone;
  zoneId: number;
  zoneName: string;
}

export interface IGetSourceList {
  data: Array<IGetSourceListData>;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SourceService extends ApiService {

  getSources(excludeVideo = false): Observable<any> {
    return this.http.get<any>(ApiService.baseApiUrl('sources'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', '100')
        .set('orderBy', 'name')
        .set('filterBy', `tenantKey eq '${this.tenantKey}'${excludeVideo ? ' and identifierTypeId ne ' + IdentifierType.Video : ''}`)
    });
  }

  getVideoCameras() {
    return this.http.get(ApiService.baseApiUrl('sources'), {
      params: new HttpParams()
        .set('orderBy', 'name')
        .set('filterBy', `tenantKey eq '${this.tenantKey}' and identifierTypeId eq ${IdentifierType.Video}`)
    });
  }

  createSource(source) {
    source.tenantKey = this.tenantKey;
    return this.http.post(ApiService.baseApiUrl('sources'), source);
  }

  editSource(sourceId, source) {
    const body = [
      {value: source.name, path: '/name', op: 'replace', from: 'intelico'},
      {value: source.description, path: '/description', op: 'replace', from: 'intelico'},
      {value: source.zoneId, path: '/zoneId', op: 'replace', from: 'intelico'},
      {value: source.typeId, path: '/typeId', op: 'replace', from: 'intelico'},
      {value: source.latitude, path: '/latitude', op: 'replace', from: 'intelico'},
      {value: source.longitude, path: '/longitude', op: 'replace', from: 'intelico'},
      {value: source.identifierTypeId, path: '/identifierTypeId', op: 'replace', from: 'intelico'}
    ];
    return this.http.patch(ApiService.baseApiUrl(`sources/${sourceId}`), body);
  }

  editIsEnabled(sourceId, source) {
    const body = [
      {value: !source, path: '/isEnabled', op: 'replace'},
    ];
    return this.http.patch(ApiService.baseApiUrl(`sources/${sourceId}`), body);
  }

  removeSource(id) {
    return this.http.delete(ApiService.baseApiUrl(`sources/${id}`));
  }

}
