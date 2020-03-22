import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';
import { Action } from '@one-core/model';

export interface TypeDataMetaData {
  category: number;
  id: number;
  tenantKey: string;
  value: string;
}

export interface DataMetaData {
  id: number;
  value: string;
  type: TypeDataMetaData;
}

interface IActions {
  type: string;
  commandType: string;
  data: Action;
}

@Injectable({
  providedIn: 'root'
})
export class ActionService extends ApiService {

  bodyRequest: IActions = {type: '', commandType: '', data: null};

  createAction(body) {
    const params = new HttpParams().set('code', this.eventApiCreateCode);
    body.tenantKey = this.tenantKey;
    this.bodyRequest.data = body;
    this.bodyRequest.type = 'actions';
    this.bodyRequest.commandType = 'One.Events.Aggregates.Actions.Commands.CreateAction, One.Events, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null';
    return this.http.post(ApiService.eventApiUrl('actions'), this.bodyRequest, {headers: this.httpHeaders, params});
  }

  deleteAction(id) {
    const params = new HttpParams().set('code', this.eventApiUpdateCode);
    const body = {
      id,
      type: 'actions',
      commandType: 'One.Events.Aggregates.Actions.Commands.DeleteAction, One.Events, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      data: {}
    };
    return this.http.post(ApiService.eventApiUrl(`events/${id}`), body, {headers: this.httpHeaders, params});
  }

  getActions(filter: string): Observable<any> {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$orderby', `createdAt desc`)
      .set('$filter', `tenantKey eq '${this.tenantKey}'${filter}`);
    return this.http.get(ApiService.readApiUrl('actions'), {params});
  }

  getActionIdentifier(filter: string) {
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$filter', `tenantKey eq '${this.tenantKey}'${(filter ? ` and ${filter}` : ``)}`);
    return this.http.get(ApiService.readApiUrl('actionidentifiers'), {params}).pipe(map((res: any) => res.results));
  }

  getActionById(id) {
    const params = new HttpParams().set('code', this.readApiDetailCode);
    return this.http.get(ApiService.readApiUrl(`actions/${id}`), {params});
  }

  editAction(id, data) {
    const params = new HttpParams()
      .set('code', this.eventApiUpdateCode)
      .set('actionId', id);
    const body = {
      id,
      type: 'actions',
      commandType: 'One.Events.Aggregates.Actions.Commands.UpdateAction, One.Events, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      data
    };
    return this.http.post(ApiService.eventApiUrl(`events/${id}`), body, {headers: this.httpHeaders, params});
  }

  updateIdentifiers(id, data) {
    const params = new HttpParams().set('code', this.eventApiUpdateCode);
    const body = {
      id,
      type: 'actions',
      commandType: 'One.Events.Aggregates.Actions.Commands.ChangeIdentifiers, One.Events, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      data
    };
    return this.http.post(ApiService.eventApiUrl(`events/${id}`), body, {params});
  }
}
