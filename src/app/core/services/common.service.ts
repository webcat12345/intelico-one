import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'angular-2-local-storage';
import { IUser } from '@one-core/service/user.service';
import { IOrganisation } from './organisation.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  currentUser: IUser = {};

  constructor(
    private localStorageService: LocalStorageService
  ) {
  }

  get userRole() {
    const jwtHelper = new JwtHelperService();
    const token = this.localStorageService.get(environment.localStorage.token) as string;
    const decodedToken = jwtHelper.decodeToken(token);
    return decodedToken[environment.jwtToken.userRoleClaims];
  }

  get userId() {
    const jwtHelper = new JwtHelperService();
    const token = this.localStorageService.get(environment.localStorage.token) as string;
    const decodedToken = jwtHelper.decodeToken(token);
    return decodedToken.sid;
  }

  get tenantKey() {
    return this.organisation.tenantKey;
  }

  get organisation(): IOrganisation {
    const org = this.localStorageService.get(environment.localStorage.organisation) as string;
    return JSON.parse(org) as IOrganisation;
  }

  storeOrganisation(org: IOrganisation) {
    this.localStorageService.set(environment.localStorage.organisation, JSON.stringify(org));
  }
}
