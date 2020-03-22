import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { FeatureFlagService } from '@one-core/service/feature-flag.service';
import { AuthService } from '../../auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SettingResolve implements Resolve<any[]> {

  constructor(
    private featureService: FeatureFlagService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> | Promise<any[]> | any[] {
    return this.featureService.getRefreshFeature().pipe(
      map(res => {
        this.featureService.settings = res.data.filter(x => x.value === true);
        return res.data;
      }),
      catchError((err) => {
        this.router.navigate(['/login']);
        return throwError(err);
      })
    );
  }
}
