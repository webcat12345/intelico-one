import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fly_NotificationMessage } from '@one-animation/common.animations';
import { InternalNotification, InternalNotificationType } from '@one-core/model';
import { ToastrService } from 'app/admin-management/services/toastr.service';

@Component({
  selector: 'one-admin-one-notifications',
  templateUrl: './one-notifications.component.html',
  styleUrls: ['./one-notifications.component.scss'],
  animations: [fly_NotificationMessage()]
})
export class OneNotificationsComponent implements OnInit, OnDestroy {

  notifications: InternalNotification[] = [];

  NotificationType = InternalNotificationType;
  updateNotification: InternalNotification;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
    this.toastrService.showNotification$.pipe(takeUntil(this.unsubscribeAll)).subscribe((notification) => {
      if (notification.type === this.NotificationType.Update) {
        this.updateNotification = notification;
      } else {
        this.notifications.push(notification);
        setTimeout(() => {
          this.notifications.splice(0, 1);
        }, 10000);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  close(notification: InternalNotification, index) {
    if (notification.type === this.NotificationType.Update) {
      document.location.reload();
    } else {
      this.notifications.splice(index, 1);
    }
  }

}
