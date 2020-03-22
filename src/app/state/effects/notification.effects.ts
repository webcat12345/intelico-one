import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadNotificationsSuccess, NotificationActionTypes } from '../actions/notification.actions';
import { NotificationService } from '@one-core/service/notification.service';
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export class NotificationEffects {

  @Effect()
  loadNotifications$ = this.actions$.pipe(
    ofType(NotificationActionTypes.LoadNotifications),
    switchMap(action => this.notificationService.getUnresolvedNotification().pipe(
      map(res => new LoadNotificationsSuccess(res))
    ))
  );

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) {
  }
}
