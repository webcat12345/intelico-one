import { Injectable } from '@angular/core';
import { ApiService } from '../interceptors/api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asset {
  id?: string;
  name: string;
  imageUrl: string;
  imageId?: string;
  imageFile?: FileList;
  latitude: any;
  longitude: any;
  groupId: string;
  sourceId: number;
  typeId: any;
  siteId: any;
  areaId: any;
  zoneId: any;
  site?: string;
  tenantKey: string;
}

export interface ItemAsset {
  item: Asset;
}

export interface Assets {
  data: Array<Asset>;
  totalCount: number;
}

export interface CreateEditAssets {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetsService extends ApiService {

  getAssets(): Observable<Assets> {
    return this.http.get<Assets>(ApiService.baseApiUrl(`assets`), {
      headers: this.httpHeaders,
      params: new HttpParams()
        .set('filterBy', `tenantKey eq '${this.tenantKey}'`)
    });
  }

  getAsset(assetId: string): Observable<ItemAsset> {
    return this.http.get<ItemAsset>(ApiService.baseApiUrl(`assets/${assetId}`), {
      headers: this.httpHeaders
    });
  }

  createAsset(assets: Asset): Observable<CreateEditAssets> {
    assets.tenantKey = this.tenantKey;
    return this.http.post<CreateEditAssets>(ApiService.baseApiUrl(`assets`), assets, {headers: this.httpHeaders});
  }

  editAsset(assetId: string, assets: Asset): Observable<CreateEditAssets> {
    return this.http.patch<CreateEditAssets>(ApiService.baseApiUrl(`assets/${assetId}`), this.convertBody(assets), {headers: this.httpHeaders});
  }

  removeAsset(assetsId: string) {
    return this.http.delete(ApiService.baseApiUrl(`assets/${assetsId}`), {headers: this.httpHeaders});
  }

  uploadImageAsset(entityId: string, imageFile: FileList): Observable<any> {
    const body = new FormData();
    body.append('EntityType', '7');
    body.append('EntityId', entityId);
    body.append('files', imageFile.item(0));
    body.append('Position', '0');
    return this.http.post<any>(ApiService.baseApiUrl(`images`), body, {headers: this.httpXWwwFormHeaders});
  }

  getImageAsset(imageId: string) {
    return this.http.get<any>(ApiService.baseApiUrl(`images/7/${imageId}`), {
      headers: this.httpXWwwFormHeaders
    });
  }

  deleteImageAsset(imageId: string) {
    return this.http.delete(ApiService.baseApiUrl(`images/${imageId}`), {headers: this.httpXWwwFormHeaders});
  }

  private convertBody(asset: Asset) {
    const body = [
      {op: 'replace', path: '/name', value: asset.name},
      {op: 'replace', path: '/latitude', value: asset.latitude},
      {op: 'replace', path: '/longitude', value: asset.longitude},
      {op: 'replace', path: '/groupId', value: asset.groupId},
      {op: 'replace', path: '/typeId', value: asset.typeId},
      {op: 'replace', path: '/siteId', value: asset.siteId},
      {op: 'replace', path: '/areaId', value: asset.areaId},
      {op: 'replace', path: '/zoneId', value: asset.zoneId},
      {op: 'replace', path: '/imageUrl', value: asset.imageUrl},
      {op: 'replace', path: '/sourceId', value: asset.sourceId},
      {op: 'replace', path: '/tenantKey', value: this.tenantKey},
    ];
    return body;
  }
}
