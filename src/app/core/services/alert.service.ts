import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { IType } from './types.service';

export { IType } from './types.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService extends ApiService {

  getAlertLevels() {
    return this.http.get(ApiService.baseApiUrl('alertLevels'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', '100')
    });
  }

  createAlertLevel(level: IType) {
    return this.http.post(ApiService.baseApiUrl('alertLevels'), level);
  }

  editAlertLevel(level: IType) {
    return this.http.put(ApiService.baseApiUrl(`alertLevels/${level.id}`), level);
  }

  removeAlertLevel(id) {
    return this.http.delete(ApiService.baseApiUrl(`alertLevels/${id}`));
  }
}
