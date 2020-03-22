import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AuthService } from './auth/services/auth.service';
import { ApiService } from './core/interceptors/api.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'one-admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    const milliseconds = (new Date(this.localStorageService.get(environment.localStorage.expiresAtToken)).getTime()) - new Date().getTime();
    if (milliseconds <= 120000 && this.authService.isLoggedIn()) {
      this.checkRefreshToken();
    }
    setInterval(() => {
      const millisecondsInterval = (new Date(this.localStorageService.get(environment.localStorage.expiresAtToken)).getTime()) - new Date().getTime();
      if (millisecondsInterval <= 120000 && this.authService.isLoggedIn()) {
        this.checkRefreshToken();
      }
    }, 10000);
  }

  checkRefreshToken(): void {
    const body = {
      type: 'refreshToken',
      token: this.localStorageService.get('REFRESH_AUTH_TOKEN')
    };
    this.http.post(ApiService.baseApiUrl('token'), body)
      .subscribe((res: any) => {
        if (!res.statusCode) {
          this.localStorageService.set(environment.localStorage.token, res.token);
          this.localStorageService.set(environment.localStorage.expiresAtToken, res.expiresAt);
        }
      }, err => {
        console.error(err);
        this.router.navigateByUrl(`/login`);
      });
  }
}
