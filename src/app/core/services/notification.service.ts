import { EventEmitter, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';
import { NotificationListItem, NotificationResponse, NotificationStatus, Priority } from '@one-core/model';
import { environment } from '../../../environments/environment';

export interface INotificationCounts {
  critical: number;
  high: number;
  normal: number;
}

export interface IUsersTeams {
  teamId: number;
  actionIds: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiService {
  usersTeams: Array<IUsersTeams>;
  notificationResolved$: EventEmitter<NotificationListItem> = new EventEmitter();
  previousId: string;
  getNotifications(filter: string, currentPage = 1, itemPerPage = 20, orderBy: string): Observable<any> {
    const filterUsersTeams = this._getUsersTeam();
    const paramsFilterUsersTeams = `and (${filterUsersTeams})`;
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$skip', `${(currentPage - 1) * itemPerPage}`)
      .set('$top', `${itemPerPage}`)
      .set('$orderby', `${orderBy} desc`)
      .set('$filter', `tenantKey eq '${this.tenantKey}'${filter} ${this.usersTeams ? paramsFilterUsersTeams : ''}`)
      .set('$count', `false`);
    return this.http.get(ApiService.readApiUrl('tasks'), {params});
  }

  getNotificationById(id) {
    const params = new HttpParams().set('code', this.readApiDetailCode);
    return this.http.get(ApiService.readApiUrl(`tasks/${id}`), {params});
  }

  getUnresolvedNotification(): Observable<NotificationResponse> {
    const filterUsersTeams = this._getUsersTeam();
    const paramsFilterUsersTeams = `and (${filterUsersTeams})`;
    const params = new HttpParams()
      .set('code', this.readApiListCode)
      .set('$skip', `0`)
      .set('$top', `20`)
      .set('$filter', `tenantKey eq '${this.tenantKey}' and status eq 100 ${this.usersTeams ? paramsFilterUsersTeams : ''}`)
      .set('$orderby', `createdAt desc`);
    return this.http.get(ApiService.readApiUrl('tasks'), {params})
      .pipe(
        map((res: any) => {
          const data: NotificationResponse = {count: res.count, notifications: []};
          data.notifications = res.results.map((item: any) => {
            return {
              type: 'vehicle',
              priority: item.priority,
              identifier: item.identifier,
              id: item.id,
              reason: item.reason,
              name: item.name,
              createdAt: item.createdAt,
              identifierTypeId: item.identifierTypeId
            };
          });
          return data;
        })
      );
  }


  resolveNotification(id, reason, comment, userId) {
    const params = new HttpParams().set('code', this.eventApiUpdateCode);
    const body = {
      id,
      type: 'tasks',
      commandType: 'One.Events.Aggregates.Tasks.Commands.ResolveTask, One.Events, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
      data: {
        reason,
        comment,
        user: userId,
      }
    };
    return this.http.post(ApiService.eventApiUrl(`events/${id}`), body, {params});
  }

  getNotificationCounts(filter: string): Observable<INotificationCounts> {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('by', 'priority')
      .set('tenantKey', `${this.tenantKey}`)
      .set('fields', 'status')
      .set('$filter', filter);
    return this.http.get<INotificationCounts>(ApiService.readApiUrl('group/tasks'), {params})
      .pipe(
        map((res: any) => {
          const normal = res.results.find(x => x.status === NotificationStatus.New && x.priority === Priority.Normal) || {total: 0};
          const high = res.results.find(x => x.status === NotificationStatus.New && x.priority === Priority.High) || {total: 0};
          const critical = res.results.find(x => x.status === NotificationStatus.New && x.priority === Priority.Critical) || {total: 0};
          return {
            high: high.total, normal: normal.total, critical: critical.total
          };
        }),
        catchError(err => {
          return of({high: 0, normal: 0, critical: 0});
        })
      );
  }

  getNotificationsBySite(filter = '') {
    const params = new HttpParams()
      .set('code', this.readApiLookupCode)
      .set('by', 'siteId')
      .set('tenantKey', `${this.tenantKey}`)
      .set('fields', 'site,lat,long')
      .set('$filter', `status eq 100${filter ? ' and ' + filter : ''}`);
    return this.http.get(ApiService.readApiUrl('group/tasks'), {params}).pipe(
      map((res: any) => res.results.filter(x => x.siteId && x.lat && x.long))
    );
  }

  private _getUsersTeam(): string {
    this.usersTeams = this.localStorageService.get(environment.localStorage.users_teams);
    const usersTeamsIds = [];
    if (this.usersTeams) {
      this.usersTeams.map((item, index) => {
        item.actionIds.map(id => {
          if (this.previousId !== id) {
            usersTeamsIds.push(`actionId eq ${id}`);
          }
          this.previousId = id;
        });
      });
    }
    return usersTeamsIds.filter(x => x).join(' or ');
  }

  /*  getNotificationsBySite(filter = '') {
      const params = new HttpParams()
        .set('code', this._readApiLookupCode)
        .set('by', 'priority')
        .set('tenantKey', `1531138254094`)
        .set('fields', 'status')
      //  .set('$filter', `status eq 100${filter ? ' and ' + filter : ''}`);
        .set('$filter', `status eq 100`);
      return this.http.get(ApiService.readApiUrl('group/tasks'), {params: params}).pipe(
        map((res: any) => res.results.filter(x => x.siteId && x.lat && x.long))
      );
    }*/

}
