import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { InternalNotification, InternalNotificationType } from '@one-core/model';
import { logError } from '../../core/utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  showNotification$: Subject<InternalNotification> = new Subject();

  constructor() {
  }

  show(type: InternalNotificationType, message: string): void {
    const notification: InternalNotification = {message, type};
    this.showNotification$.next(notification);
  }

  success(message: string): void {
    this.show(InternalNotificationType.Success, message);
  }

  error(message: string, error?: any): void {
    logError(error);
    this.show(InternalNotificationType.Error, message || 'There seems to be a problem - please try again.');
  }

  warning(message: string, error?: any): void {
    logError(error);
    this.show(InternalNotificationType.Warning, message);
  }

  update(message: string): void {
    this.show(InternalNotificationType.Update, message);
  }

  alert(message: string): void {
    this.show(InternalNotificationType.Alert, message);
  }
}
