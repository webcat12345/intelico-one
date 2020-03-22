import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { LayerCategory } from '@one-core/model';
import { Observable } from 'rxjs';

export interface Layers {
  data: Array<any>;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class LayerService extends ApiService {

  getLayers(category: LayerCategory, pageNumber: number = 1, query = ''): Observable<Layers> {
    const filter = `tenantKey eq '${this.tenantKey}' and category eq '${category}'${query ? ' and ' + query : ''}`;
    return this.http.get<Layers>(ApiService.baseApiUrl('layers'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('OrderBy', 'name')
        .set('filterBy', filter)
    });
  }

  getAllLayers() {
    return this.http.get(ApiService.baseApiUrl('layers'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', '100')
        .set('OrderBy', 'name')
        .set('filterBy', `tenantKey eq '${this.tenantKey}'`)
    });
  }

  deleteLayer(id) {
    return this.http.delete(ApiService.baseApiUrl(`layers/${id}`));
  }

  getUnassignedLayers(category: LayerCategory) {
    return this.http.get(ApiService.baseApiUrl('layers'), {
      params: new HttpParams()
        .set('filterBy', `tenantKey eq '${this.tenantKey}' and category eq '${category}' and parentId eq null`)
    });
  }

  createLayer(layer) {
    layer.tenantKey = this.tenantKey;
    layer.metadata.description = layer.description;
    return this.http.post(ApiService.baseApiUrl('layers'), layer);
  }

  patchLayer(id, value) {
    return this.http.patch(ApiService.baseApiUrl(`layers/${id}`), value);
  }

  editLayer(layer) {
    const id = layer.id;
    delete layer.id;

    return this.http.put(ApiService.baseApiUrl(`layers/${id}`), layer);
  }

  editLayerProperty(propertyName: string, layer) {
    const id = layer.id;

    let propVal: any = '';
    if (propertyName === 'name') {
      propVal = layer.name;
    } else if (propertyName === 'typeId') {
      propVal = layer.typeId;
    }

    return this.http.patch(ApiService.baseApiUrl(`layers/${id}`), [{from: 'intelico', op: 'replace', path: '/' + propertyName, value: propVal}])
      .subscribe(() => {
      });
  }

  updateLayerProperty(replaceParams: any, layer) {
    const id = layer.id;
    return this.http.patch(ApiService.baseApiUrl(`layers/${id}`), replaceParams)
      .subscribe(() => {
      });
  }

  removeLayer(id) {
    return this.http.delete(ApiService.baseApiUrl(`layers/${id}`));
  }

  getLayerDetail(id): Observable<any> {
    return this.http.get(ApiService.baseApiUrl(`layers/${id}`));
  }

}
