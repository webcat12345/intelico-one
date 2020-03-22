import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';

export interface ITeamUser {
  id: number;
  teamId: number;
  userId: string;
}

export interface ITeam {
  id: number;
  name: string;
  description: string;
  tenantKey?: string;
  teamUsers?: ITeamUser[];
}

export interface ITeamList {
  data: ITeam[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiService {

  getTeams(pageNumber: number = 1) {
    return this.http.get(ApiService.baseApiUrl('teams'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', '100')
    });
  }

  getTeamsByTenant(pageNumber: number = 1) {
    return this.http.get(ApiService.baseApiUrl('teams'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', '100')
        .set('filterBy', ` tenantKey eq '${this.tenantKey}'`)
    });
  }

  createTeam(team: ITeam) {
    const payload = {
      name: team.name,
      description: team.description,
      tenantKey: this.tenantKey
    };
    return this.http.post(ApiService.baseApiUrl('teams'), payload);
  }

  addTeamUsers(teamUsers: any[]) {
    return this.http.post(ApiService.baseApiUrl('teams/users'), {teamUsers});
  }

  removeTeamUsers(teamUsers: number[]) {
    return this.http.request('delete', ApiService.baseApiUrl('teams/users'), {body: {teamUsers}});
  }

  editTeam(team: ITeam) {
    const payload = [
      {
        op: 'replace',
        path: '/name',
        value: team.name
      },
      {
        op: 'replace',
        path: '/description',
        value: team.description
      }
    ];
    return this.http.patch(ApiService.baseApiUrl(`teams/${team.id}`), payload);
  }

  removeTeam(id) {
    return this.http.delete(ApiService.baseApiUrl(`teams/${id}`));
  }

}
