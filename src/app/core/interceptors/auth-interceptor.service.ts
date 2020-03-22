import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// One - Services
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
  ) {
  }

  private static _handleAuthError(err: HttpErrorResponse): Observable<any> {
    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.get(environment.localStorage.token);
    const duplicate = req.clone({headers: req.headers.set('Authorization', token ? 'bearer ' + token.toString() : 'bearer')});
    return next.handle(duplicate)
      .pipe(
        catchError(err => AuthInterceptor._handleAuthError(err))
      );
  }
}
