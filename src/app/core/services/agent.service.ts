import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';

export interface IAgent {
  id: number;
  name: string;
}

export interface IAgentList {
  data: IAgent[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService extends ApiService {

  getAgents() {
    return this.http.get(ApiService.baseApiUrl('agents'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', '100')
    });
  }

  createAgent(agent: IAgent) {
    return this.http.post(ApiService.baseApiUrl('agents'), agent);
  }

  editAgent(agent: IAgent) {
    return this.http.put(ApiService.baseApiUrl(`agents/${agent.id}`), agent);
  }

  removeAgent(id) {
    return this.http.delete(ApiService.baseApiUrl(`agents/${id}`));
  }

}
