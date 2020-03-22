import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// One - Services
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/interceptors/api.service';
import { IForgotPassword, IForgotPasswordForm, ILogin } from '../../core/models/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  login(body: ILogin): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(ApiService.baseApiUrl('token'), body)
        .subscribe((res: any) => {
          if (!res.statusCode) {
            this.localStorageService.set(environment.localStorage.token, res.token);
            this.localStorageService.set(environment.localStorage.refresh_token, res.refreshToken);
            this.getUsersTeam();
            resolve({success: true, message: 'You logged in successfully.'});
          } else if (res.statusCode === 400) {
            reject({success: false, message: 'Email and password does not match.'});
          } else {
            reject({success: false, message: 'Incorrect username or password. Please try again.'});
          }
        }, err => {
          reject({success: false, message: 'Incorrect username or password. Please try again.'});
        });
    });
  }

  isLoggedIn(): boolean {
    return this.localStorageService.get(environment.localStorage.token) ? true : false;
  }

  getUserInfo() {
    return this.http.get(ApiService.baseApiUrl('account/organisation'));
  }

  getUsersTeam(): any {
    this.http.get<any>(ApiService.baseApiUrl('users/teams'))
      .subscribe(
        resp => {
          if (resp) {
            if (resp.totalCount > 0) {
              this.localStorageService.set(environment.localStorage.users_teams, resp.data);
            } else {
              this.localStorageService.set(environment.localStorage.users_teams, null);
            }
          }
        }, error => console.log(error)
      );
  }

  forgotPassword(body: IForgotPassword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(ApiService.baseApiUrl('account/forgotpassword'), body)
        .pipe(catchError(error => {
          reject({success: false, message: 'Email does not match.'});
          throw error;
        }))
        .subscribe((res: any) => {
          resolve({success: true, message: 'An email has been sent to this email address, Please follow activation link from there. The link below will remain active for 25 hours.'});
        });
    });
  }

  resetPassword(body: IForgotPasswordForm): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(ApiService.baseApiUrl('account/resetpassword'), body)
        .subscribe((res: any) => {
          resolve({success: true, message: 'Password has changed successfully.'});
        }, err => {
          let errorMessage = 'Something went wrong. Please try again.';
          if (err.error.errors && err.error.errors.length > 0) {
            errorMessage = err.error.errors[0].message;
          }
          reject({success: false, message: errorMessage});
        });
    });
  }

  changePassword(body: any) {
    return this.http.post(ApiService.baseApiUrl('account/changepassword'), body);
  }
}
