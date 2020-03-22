/* tslint:disable:variable-name */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { sliderQue } from '@one-animation/sliderQue.animation';
import { CommonService } from '@one-core/service/common.service';
import { thrilling_AlertCircle } from '@one-animation/common.animations';
import { NotificationService } from '@one-core/service/notification.service';
import { EventHub, Notification, NotificationAlert, NotificationListItem, NotificationResponse, Priority } from '@one-core/model';

import { PersonalSettings } from '../../models';
import { WindowName } from '../../meta/admin-meta';
import { HubService } from '@one-core/service/hub.service';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';
import { environment } from '../../../../environments/environment';
import { AdminManagementService } from '../../services/admin-management.service';
import { encodeHubData, HubConnectionName, HubConnectionType } from '../../../core/utils/hub.util';
import { ReceiveNotification, ToggleNotifications } from '../../../state/actions/notification.actions';

declare var signalR: any;

@Component({
  selector: 'one-admin-admin-alerts-menu',
  templateUrl: './admin-alerts-menu.component.html',
  styleUrls: ['./admin-alerts-menu.component.scss'],
  animations: [sliderQue(), thrilling_AlertCircle()]
})
export class AdminAlertsMenuComponent implements OnInit, OnDestroy {

  @Input() settings: PersonalSettings;
  @Output() openAlertsWindow: EventEmitter<any> = new EventEmitter();

  Priority = Priority;
  circleState = 'one';
  alerts: NotificationAlert[] = [];
  totalCount = 0;

  private alertHubConnection: any;
  private historyHubConnection: any;
  private updateHubConnection: any;
  private reconnect = true;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private adminManagementService: AdminManagementService,
    private store: Store<any>,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private hubService: HubService
  ) {}
  private static _createHubConnection(name: HubConnectionName): any {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apis.socket}/${name}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  ngOnInit(): void {
    this.notificationService.getUnresolvedNotification().subscribe((data: NotificationResponse) => {
      this.totalCount = data.count;
      const notifications = data.notifications;
      this.alerts = notifications.slice(0, 10).map(a => {
        return {...a, timeElapsed: moment(a.createdAt).fromNow()} as NotificationAlert;
      });

      timer(0, 3000).pipe(
        takeUntil(this.unsubscribeAll),
        tap(() => {
          this.alerts.map(x => {
            // moment js ignores 44 second as a "few seconds ago - custom function to get exact diff value
            if (Math.abs(moment().diff(x.createdAt)) < 60000) {
              x.timeElapsed = Math.floor(moment().diff(x.createdAt) / 1000) + ' seconds ago';
            } else {
              x.timeElapsed = moment(x.createdAt).fromNow();
            }
          });
        })
      ).subscribe();

      this.notificationService.notificationResolved$.pipe(
        takeUntil(this.unsubscribeAll),
        tap((alert: NotificationListItem) => {
          const index = this.alerts.findIndex(x => x.id === alert.id);
          if (index > -1) {
            this.alerts.splice(index, 1);
          }
          this.totalCount--;
        })
      ).subscribe();

      this.connect();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
    this.reconnect = false;
    this.alertHubConnection.stop();
    this.historyHubConnection.stop();
    this.updateHubConnection.stop();
  }

  connect(): void {
    this.alertHubConnection = AdminAlertsMenuComponent._createHubConnection(HubConnectionName.Notification);
    this.historyHubConnection = AdminAlertsMenuComponent._createHubConnection(HubConnectionName.History);
    this.updateHubConnection = AdminAlertsMenuComponent._createHubConnection(HubConnectionName.Update);

    this.alertHubConnection.on(HubConnectionType.Notification, (data: Notification) => {
      if (data.tenantKey === this.commonService.tenantKey) {
        // action name is name
        data.name = data.actionName;
        this.hubService.hubStream$.emit(encodeHubData(HubConnectionType.Notification, data));

        this.adminManagementService.playSound(environment.sounds.alertClose);
        this.store.dispatch(new ReceiveNotification(data));
        this.alerts.splice(0, 0, {...data, timeElapsed: moment(data.createdAt).fromNow()});
        this.totalCount++;
        setTimeout(() => {
          this.alerts.splice(this.alerts.length - 1, 1);
        }, 1);
      } else {
        // other org data
      }
    });

    this.historyHubConnection.on(HubConnectionType.History, (data: EventHub) => {
      if (data.tenantKey === this.commonService.tenantKey) {
        this.hubService.hubStream$.emit(encodeHubData(HubConnectionType.History, data));
      }
    });

    this.updateHubConnection.on(HubConnectionType.Update, (data: any) => {
      if (data.Data.TenantKey === this.commonService.tenantKey) {
        this.notificationService.notificationResolved$.next({
          id: data.Data.Id
        } as any);
        this.hubService.hubStream$.emit(encodeHubData(HubConnectionType.Update, data));
      }
    });

    this.connectToHub(this.alertHubConnection);
    this.connectToHub(this.historyHubConnection);
    this.connectToHub(this.updateHubConnection);
  }

  toggle(): void {
    this.store.dispatch(new ToggleNotifications());
    const notificationData = {
      triggerInside: true,
      data: {},
      message: EVENT_MESSAGE.NOTIFICATION_OPEN_WITHOUT_ANY_FILTER
    };
    this.adminManagementService.openAdminSubWindow(WindowName.Alert, false, notificationData);
  }

  openAlert(alert: any): void {
    const notificationData = {
      triggerInside: true,
      data: alert,
      message: EVENT_MESSAGE.NOTIFICATION_FILTER_BY_SELECTED_IDENTIFIER
    };
    this.adminManagementService.openAdminSubWindow(WindowName.Alert, false, notificationData);
  }

  private connectToHub(connection, reconnectTimeout = 1000): void {
    connection.onclose((res) => {
      if (this.reconnect) {
        setTimeout(() => {
          connection.start();
        }, reconnectTimeout);
      }
    });
    connection.start().then(() => console.log('connected!')).catch((e) => console.error(e));
  }
}
