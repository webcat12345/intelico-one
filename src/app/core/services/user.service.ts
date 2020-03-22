import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { CreateEditPeople } from '@one-core/service/people.service';
import { Observable } from 'rxjs';

export interface Organizations {
  mobile: string;
  organizationId: string;
  ownersType: string;
}

export interface IUser {
  id?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  userType?: number;
  mobile?: string;
  phoneNumber?: string;
  password?: string;
  siteName?: string;
  teamName?: string;
  teamId?: string;
  isNewEntry?: boolean;
  fullName?: string;
  organizationIds?: [];
  organizations?: Array<Organizations>;
  tenantKey?: string;
  newRole?: string;

  isDeleted?: boolean;
}

export interface IUserList {
  data: IUser[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  getAccount(): Observable<any> {
    return this.http.get(ApiService.baseApiUrl('account'));
  }

  getIntelicoUsers(pageNumber: number = 1): Observable<any> {
    return this.http.get(ApiService.baseApiUrl('users'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('OrderBy', 'firstName')
        .set('filterBy', 'role eq "Super Admin"')
    });
  }

  getAdminUsers(): Observable<any> {
    return this.http.get(ApiService.baseApiUrl('users'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('filterBy', 'role eq "Admin"')
    });
  }

  getUserById(id): Observable<any> {
    return this.http.get(ApiService.baseApiUrl(`users/${id}`));
  }

  createUser(user: IUser): Observable<any> {
    return this.http.post(ApiService.baseApiUrl('users'), user);
  }

  editUser(user: IUser): Observable<any> {
    return this.http.patch<CreateEditPeople>(ApiService.baseApiUrl(`users/${user.id}`), this.convertBody(user), {headers: this.httpHeaders});
  }

  removeUser(id): Observable<any> {
    return this.http.delete(ApiService.baseApiUrl(`users/${id}`));
  }

  private convertBody(user): Array<any> {
    const body = [
      {op: 'replace', path: '/firstName', value: user.firstName},
      {op: 'replace', path: '/lastName', value: user.lastName},
      {op: 'replace', path: '/email', value: user.email},
      {op: 'replace', path: '/tenantKey', value: this.tenantKey},
      {op: 'replace', path: '/mobile', value: user.mobile},
      {op: 'replace', path: '/role', value: user.role},
    ];
    return body;
  }

}
