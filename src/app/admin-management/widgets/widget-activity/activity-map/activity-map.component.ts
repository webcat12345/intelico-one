import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { wait } from '../../../../core/utils/common.util';
import { HubService } from '@one-core/service/hub.service';
import { ToastrService } from '../../../services/toastr.service';
import { HistoryService } from '@one-core/service/history.service';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { ClusterMapItem, EventHub, IdentifierType } from '@one-core/model';
import { OneClusterMapComponent } from '../../../../common/one-cluster-map/one-cluster-map.component';
import { HubConnectionType } from '../../../../core/utils/hub.util';

@Component({
  selector: 'one-admin-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.scss']
})
export class ActivityMapComponent implements OnInit, OnDestroy {

  @Input() sidebarFilter = '';
  @Input() searchKeyFilter = '';
  @Output() newActivityArrived: EventEmitter<any> = new EventEmitter();

  @ViewChild(OneClusterMapComponent, {static: true}) map: OneClusterMapComponent;

  isLoading = false;
  search$: Subject<any> = new Subject<any>();
  activityBySite: ClusterMapItem[] = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private toastr: ToastrService,
    private historyService: HistoryService,
    private hubService: HubService,
  ) {
  }

  ngOnInit(): void {
    this.search$.asObservable().pipe(
      debounceTime(1000),
      takeUntil(this.unsubscribeAll),
      tap(() => this.getActivityBySite())
    ).subscribe();
    this.hubService.getHubStreamByType(HubConnectionType.History).pipe(
      takeUntil(this.unsubscribeAll),
      filter((data: EventHub) => data.identifierTypeId !== IdentifierType.Video),
      tap(x => {
        if (this.activityBySite && this.activityBySite.length > 0) {
          const res = this.activityBySite.find(site => site.siteId === x.locationDetails.siteId);
          if (res) {
            res.total += 1;
          }
        } else {
          this.activityBySite = [{
            siteId: x.locationDetails.siteId,
            total: 1,
            site: x.locationDetails.site,
            lat: x.latitude,
            long: x.longitude
          }];
        }
        this.newActivityArrived.emit();
      })
    ).subscribe();
    this.search$.next();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  filterChanged(sidebarFilter, searchKeyFilter): void {
    this.sidebarFilter = sidebarFilter;
    this.searchKeyFilter = searchKeyFilter;
    this.search$.next();
  }

  async getActivityBySite(): Promise<void> {
    try {
      this.isLoading = true;
      let filterString = this.sidebarFilter;
      if (this.sidebarFilter && this.searchKeyFilter) {
        filterString += ` and ${this.searchKeyFilter}`;
      } else if (!this.sidebarFilter && this.searchKeyFilter) {
        filterString += this.searchKeyFilter;
      }
      this.activityBySite = await this.historyService.getHistoryBySite(filterString).toPromise();
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
