import { Action } from '@ngrx/store';
import { Notification, NotificationResponse } from '@one-core/model';

export enum NotificationActionTypes {
  LoadNotifications = '[Notification] Load Notifications',
  LoadNotificationsSuccess = '[Notification] Load Notifications Success',
  LoadNotificationsFailure = '[Notification] Load Notifications Failure',
  ToggleNotifications = '[Notification] Toggle Notifications',
  ReceiveNotification = '[Notification] Receive Notification'
}

export class LoadNotifications implements Action {
  readonly type = NotificationActionTypes.LoadNotifications;
}

export class LoadNotificationsSuccess implements Action {
  readonly type = NotificationActionTypes.LoadNotificationsSuccess;

  constructor(public payload: NotificationResponse) {
  }
}

export class LoadNotificationsFailure implements Action {
  readonly type = NotificationActionTypes.LoadNotificationsFailure;
}

export class ToggleNotifications implements Action {
  readonly type = NotificationActionTypes.ToggleNotifications;
}

export class ReceiveNotification implements Action {
  readonly type = NotificationActionTypes.ReceiveNotification;

  constructor(public payload: Notification) {
  }
}

export type NotificationActions = LoadNotifications
  | LoadNotificationsSuccess
  | LoadNotificationsFailure
  | ToggleNotifications
  | ReceiveNotification;
