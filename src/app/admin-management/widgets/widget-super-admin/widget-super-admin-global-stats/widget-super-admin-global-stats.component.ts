import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { flyIn } from '@one-animation/flyIn.animation';
import { DateRange } from '@one-common/filter/one-filter.model';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { GlobalStatsService, IGlobalStatsList } from '@one-core/service/global-stats.service';
import { IOrganisationList, OrganisationService } from '@one-core/service/organisation.service';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-global-stats',
  templateUrl: './widget-super-admin-global-stats.component.html',
  styleUrls: ['./widget-super-admin-global-stats.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetSuperAdminGlobalStatsComponent implements OnInit, OnDestroy {

  isLoading = false;
  searchKey = null;
  stats: IGlobalStatsList = {data: [], totalCount: 0};
  info: Array<TableInfo> = [
    {label: 'Organisation Name', name: 'orgName', width: '28%', isLink: false},
    {label: 'Activity', name: 'activityTotal', width: '12%', isLink: false},
    {label: 'Alerts', name: 'alertsTotal', width: '12%', isLink: false},
    {label: 'SMS', name: 'smsTotal', width: '12%', isLink: false},
    {label: 'WhatsApp', name: 'whatsAppTotal', width: '12%', isLink: false},
    {label: 'Phone Call', name: 'phoneCallTotal', width: '12%', isLink: false},
    {label: 'Email', name: 'emailTotal', width: '12%', isLink: false}
  ];
  footerInfo: Array<TableInfo>;
  dateFilter: string;
  activityCounter = 0;
  alertCounter = 0;
  smsCounter = 0;
  whatsAppCounter = 0;
  phoneCallCounter = 0;
  emailCounter = 0;

  private unsubscribe = new Subject<void>();

  constructor(
    private globalStatsService: GlobalStatsService,
    private organisationService: OrganisationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.initStats();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initStats(filter = null) {
    this.isLoading = true;

    this.stats = {data: [], totalCount: 0};
    this.activityCounter = 0;
    this.alertCounter = 0;
    this.smsCounter = 0;
    this.whatsAppCounter = 0;
    this.phoneCallCounter = 0;
    this.emailCounter = 0;

    let rangeLabel = 'All time';
    if (filter && filter.typeDateRange) {
      switch (filter.typeDateRange) {
        case DateRange.Today:
          rangeLabel = 'Today';
          break;
        case DateRange.Yesterday:
          rangeLabel = 'Yesterday';
          break;
        case DateRange.Last7days:
          rangeLabel = 'Last 7 days';
          break;
        case DateRange.Last14days:
          rangeLabel = 'Last 14 days';
          break;
        case DateRange.ThisMonth:
          rangeLabel = 'This month';
          break;
        case DateRange.LastMonth:
          rangeLabel = 'Last month';
          break;
        case DateRange.Custom:
          rangeLabel = 'Custom';
          break;
        default:
          break;
      }
    }
    this.footerInfo = [
      {label: `Global Stats in ${rangeLabel}`, name: 'stats', width: '28%', isLink: false},
      {label: 0, name: 'activityTotal', width: '12%', isLink: false, isLoading: true},
      {label: 0, name: 'alertsTotal', width: '12%', isLink: false, isLoading: true},
      {label: 0, name: 'smsTotal', width: '12%', isLink: false, isLoading: true},
      {label: 0, name: 'whatsAppTotal', width: '12%', isLink: false, isLoading: true},
      {label: 0, name: 'phoneCallTotal', width: '12%', isLink: false, isLoading: true},
      {label: 0, name: 'emailTotal', width: '12%', isLink: false, isLoading: true}
    ];
    this.organisationService.getAllOrganisations().subscribe((res: IOrganisationList) => {
      this.isLoading = false;
      if (res) {
        this.stats.totalCount = res.totalCount;
        if (res && res.data) {
          res.data.forEach((org) => {
            this.stats.data.push({
              orgId: org.id,
              orgName: org.name,
              tenantKey: org.tenantKey,
              activityTotal: {
                isLoading: true
              },
              alertsTotal: {
                isLoading: true
              },
              smsTotal: {
                isLoading: true
              },
              whatsAppTotal: {
                isLoading: true
              },
              phoneCallTotal: {
                isLoading: true
              },
              emailTotal: {
                isLoading: true
              }
            });
          });
          this.stats.data.forEach((org) => {
            if (org.tenantKey) {
              const entry = this.getOrgById(org.orgId);
              const range = filter && filter.data ? `and ${filter.data}` : '';
              this.loadCountBy('history', range, org.tenantKey, entry, 'activityTotal');
              this.loadCountBy('tasks', range, org.tenantKey, entry, 'alertsTotal');
              this.loadCountBy('alerts', `and type eq 2 ${range}`, org.tenantKey, entry, 'smsTotal');
              this.loadCountBy('alerts', `and type eq 4 ${range}`, org.tenantKey, entry, 'whatsAppTotal');
              this.loadCountBy('alerts', `and type eq 3 ${range}`, org.tenantKey, entry, 'phoneCallTotal');
              this.loadCountBy('alerts', `and type eq 1 ${range}`, org.tenantKey, entry, 'emailTotal');
            }
          });
        }
      }
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(null, err);
    });
  }

  loadCountBy(table, filter, tenantKey, entry, key) {
    this.globalStatsService.getTenantStat(table, tenantKey, filter).subscribe((res) => {
      const count = res && res.count ? res.count : 0;
      if (entry) {
        entry[key] = {
          isLoading: false,
          value: count || 0
        };
        const total = this.getFooterInfoBy(key);
        if (total) {
          total.label += entry[key].value;
        }
        switch (key) {
          case 'activityTotal':
            this.activityCounter++;
            if (this.activityCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          case 'alertsTotal':
            this.alertCounter++;
            if (this.alertCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          case 'smsTotal':
            this.smsCounter++;
            if (this.smsCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          case 'whatsAppTotal':
            this.whatsAppCounter++;
            if (this.whatsAppCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          case 'phoneCallTotal':
            this.phoneCallCounter++;
            if (this.phoneCallCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          case 'emailTotal':
            this.emailCounter++;
            if (this.emailCounter >= this.stats.data.length) {
              this.bulkUpdateTable(this.footerInfo, [key], 'isLoading', false);
            }
            break;
          default:
            break;
        }
      }
    }, (err) => {
      this.toastr.error(null, err);
    });
  }

  bulkUpdateTable(tableInfo: Array<TableInfo>, cols: string[], key: string, value: any) {
    tableInfo.forEach((info) => {
      if (cols.indexOf(info.name) !== -1) {
        info[key] = value;
      }
    });
  }

  getOrgById(orgId: string) {
    if (this.stats && this.stats.data) {
      return this.stats.data.find((entry) => entry.orgId === orgId);
    }
    return null;
  }

  getFooterInfoBy(name: string) {
    return this.footerInfo.find((entry) => entry.name === name);
  }

  changeSearchKeyFilter($event) {
    this.searchKey = $event || null;
  }

  changeFilterClearAll($event) {
    this.searchKey = null;
  }

  changeFilterBtn($event) {
    this.initStats(this.dateFilter);
  }

  changeFilter($event) {
    this.dateFilter = $event;
  }

  customFilterSelected($event) {
  }

  changeCustomFilter($event) {
  }

}
