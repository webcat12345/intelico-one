import { Component, OnDestroy, OnInit } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { WindowName } from '../../meta/admin-meta';
import { HubService } from '@one-core/service/hub.service';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';
import { sliderQue } from '@one-animation/sliderQue.animation';
import { CommonService } from '@one-core/service/common.service';
import { NotificationListItem, Priority } from '@one-core/model';
import { HubConnectionType } from '../../../core/utils/hub.util';
import { NotificationService } from '@one-core/service/notification.service';
import { AdminManagementService } from '../../services/admin-management.service';

@Component({
  selector: 'one-admin-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
  animations: [sliderQue()],
})
export class AdminNavComponent implements OnInit, OnDestroy {

  isLoading = false;
  startDate: string;
  endDate: string;
  notifyCount = {high: 0, critical: 0, normal: 0};
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private adminManagementService: AdminManagementService,
    public commonService: CommonService,
    private notificationService: NotificationService,
    private hubService: HubService
  ) {
  }

  ngOnInit() {
    const now = new Date();
    const dayStart = new Date(new Date().setUTCDate(now.getDate() - 7));
    const yesterday = new Date(new Date().setUTCDate(now.getDate() - 1));
    this.startDate = new Date(dayStart.setUTCHours(0, 0, 0)).toISOString();
    this.endDate = new Date(yesterday.setUTCHours(23, 59, 59)).toISOString();
    try {
      this.isLoading = true;
      // const filter = `status eq 100 and createdAt ge ${this.startDate} and createdAt lt ${this.endDate}`;
      const filter = `status eq 100`;
      this.notificationService.getNotificationCounts(filter).subscribe((count) => {
        this.isLoading = false;
        this.notifyCount = count;
        this.notificationService.notificationResolved$.pipe(
          takeUntil(this.unsubscribeAll),
          tap((x: NotificationListItem) => {
            if (x.priority === Priority.Normal) {
              this.notifyCount.normal--;
            } else if (x.priority === Priority.High) {
              this.notifyCount.high--;
            } else if (x.priority === Priority.Critical) {
              this.notifyCount.critical--;
            }
          })
        ).subscribe();

        this.hubService.getHubStreamByType(HubConnectionType.Notification).pipe(
          takeUntil(this.unsubscribeAll),
          tap(x => {
            if (x.priority === Priority.Normal) {
              this.notifyCount.normal++;
            } else if (x.priority === Priority.High) {
              this.notifyCount.high++;
            } else if (x.priority === Priority.Critical) {
              this.notifyCount.critical++;
            }
          })
        ).subscribe();
      }, (err) => this.isLoading = false);
    } catch (e) {
      console.error(e);
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openNotificationWindow(type: string) {
    const notificationData = {
      triggerInside: true,
      data: type,
      message: EVENT_MESSAGE.NOTIFICATION_FILTER_BY_PRIORITY
    };
    this.adminManagementService.openAdminSubWindow(WindowName.Alert, false, notificationData);
  }
}
