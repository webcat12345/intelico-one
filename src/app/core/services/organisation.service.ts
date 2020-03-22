import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';
import { IUser } from '@one-core/service/user.service';

export interface IOrganisationList {
  data: IOrganisation[];
  totalCount: number;
}

export interface IOrganisation {
  id: string;
  name: string;
  tenantKey: string;
  users?: number;
  sites?: number;
  selectedDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrganisationService extends ApiService {

  getOrganisations(pageNumber: number = 1) {
    return this.http.get(ApiService.baseApiUrl('organization'), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `${100}`)
        .set('OrderBy', 'name')
    });
  }

  getAllOrganisations(totalRecords: number = 1000) {
    return this.http.get(ApiService.baseApiUrl('organization'), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', `${totalRecords}`)
        .set('OrderBy', 'name')
    });
  }

  createOrganisation(org: IOrganisation) {
    return this.http.post(ApiService.baseApiUrl('organization'), org);
  }

  setOrgUser(orgId, userId) {
    const body = {
      organizationId: orgId,
      userId
    };
    return this.http.post(ApiService.baseApiUrl('organization/users'), body);
  }

  getOrgAdminUsers(orgId) {
    return this.http.get(ApiService.baseApiUrl(`organization/${orgId}/users`), {
      params: new HttpParams()
        .set('pageNumber', '1')
        .set('filterBy', 'role eq "Admin"')
    });
  }

  getOrgUsers(orgId, pageNumber: number = 1) {
    return this.http.get(ApiService.baseApiUrl(`organization/${orgId}/users`), {
      params: new HttpParams()
        .set('pageNumber', `${pageNumber - 1}`)
        .set('RecordCount', `100`)
        .set('OrderBy', 'firstName')
    });
  }

  getOrgTeams() {
    return this.http.get(ApiService.baseApiUrl(`teams`));
  }

  searchOrgUsersByName(orgId, firstname, lastname) {
    firstname = firstname.toLowerCase();
    lastname = lastname.toLowerCase();
    return this.http.get(ApiService.baseApiUrl(`organization/${orgId}/users`), {
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('filterBy', `firstName.toLower() eq "${firstname}" and lastName.toLower() eq "${lastname}"`)
    });
  }

  searchOrgUsersByEmail(email): Observable<IUser> {
    email = email.toLowerCase();
    return this.http.post<IUser>(ApiService.baseApiUrl(`organization/users/search`), {
      email
    }).pipe(
      catchError(err => of(null))
    );
  }

  removeUserFromOrg(orgId, userId) {
    return this.http.delete(ApiService.baseApiUrl(`organization/${orgId}/users/${userId}`));
  }

  editOrganisation(id, body) {
    return this.http.patch(ApiService.baseApiUrl(`organization/${id}`), body);
  }

  removeOrganisation(id) {
    return this.http.delete(ApiService.baseApiUrl(`organization/${id}`));
  }

  assignUserRoleInOrg(orgId, id, role) {
    let value = 4;
    if (role === 'Operator') {
      value = 3;
    } else if (role === 'Admin') {
      value = 2;
    } else if (role === 'User') {
      value = 4;
    }
    const body = [
      {value, path: '/ownersType', op: 'replace', from: 'intelico'}
    ];
    return this.http.patch(ApiService.baseApiUrl(`organization/${orgId}/users/${id}`), body);
  }

  editOrganisationUser(orgId, id, user) {
    const body = [
      {value: user.firstName, path: '/firstName', op: 'replace', from: 'intelico'},
      {value: user.lastName, path: '/lastName', op: 'replace', from: 'intelico'},
      // {value: user.email, path: '/email', op: 'replace', from: 'intelico'},
      {value: user.mobile, path: '/mobile', op: 'replace', from: 'intelico'},
      {value: user.userType, path: '/ownersType', op: 'replace', from: 'intelico'},
    ];
    return this.http.patch(ApiService.baseApiUrl(`organization/${orgId}/users/${id}`), body);
  }

}
