import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HubConnectionType, HubData } from '../utils/hub.util';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  hubStream$: EventEmitter<HubData> = new EventEmitter<HubData>();

  constructor() {
  }

  getHubStreamByType(type: HubConnectionType): Observable<any> {
    return this.hubStream$.pipe(
      filter((data: HubData) => data.type === type),
      map((data: HubData) => data.data)
    );
  }
}
