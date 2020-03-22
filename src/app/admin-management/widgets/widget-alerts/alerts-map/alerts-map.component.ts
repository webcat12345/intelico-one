import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationService } from '@one-core/service/notification.service';
import { ClusterMapItem, NotificationItemViewModel } from '@one-core/model';
import { ToastrService } from '../../../services/toastr.service';
import { OneClusterMapComponent } from '../../../../common/one-cluster-map/one-cluster-map.component';
import { wait } from '../../../../core/utils/common.util';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { getNotificationFromSocketData, HubConnectionType } from '../../../../core/utils/hub.util';
import { HubService } from '@one-core/service/hub.service';

@Component({
  selector: 'one-admin-alerts-map',
  templateUrl: './alerts-map.component.html',
  styleUrls: ['./alerts-map.component.scss']
})
export class AlertsMapComponent implements OnInit, OnDestroy {

  @Input() sidebarFilter = '';
  @Input() searchKeyFilter = '';
  @Output() newAlertArrived: EventEmitter<any> = new EventEmitter();

  @ViewChild(OneClusterMapComponent, {static: true}) map: OneClusterMapComponent;

  isLoading = false;
  search$: Subject<any> = new Subject<any>();
  alertsBySite: ClusterMapItem[] = [];

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private notificationService: NotificationService,
    private hubService: HubService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getAlertsBySite())
    ).subscribe();
    this.hubService.getHubStreamByType(HubConnectionType.Notification).pipe(
      takeUntil(this.unsubscribeAll),
      tap(x => {
        const data: NotificationItemViewModel = getNotificationFromSocketData(x);
        const group = this.alertsBySite.find(item => item.siteId === data.siteId);
        if (group) {
          group.total += 1;
        } else {
          this.alertsBySite.push({
            siteId: x.locationDetails.siteId,
            total: 1,
            site: x.locationDetails.site,
            lat: x.latitude,
            long: x.longitude
          });
        }
        this.newAlertArrived.emit();
      })
    ).subscribe();
    this.search$.next();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  filterChanged(sidebarFilter, searckKeyFilter) {
    this.sidebarFilter = sidebarFilter;
    this.searchKeyFilter = searckKeyFilter;
    this.search$.next();
  }

  async getAlertsBySite() {
    try {
      this.isLoading = true;
      let filterString = this.sidebarFilter;
      if (this.sidebarFilter && this.searchKeyFilter) {
        filterString += ` and ${this.searchKeyFilter}`;
      } else if (!this.sidebarFilter && this.searchKeyFilter) {
        filterString += this.searchKeyFilter;
      }
      this.alertsBySite = await this.notificationService.getNotificationsBySite(filterString).toPromise();
      await wait(100);
      if (this.map) {
        this.map.checkMapUpdates(true);
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
