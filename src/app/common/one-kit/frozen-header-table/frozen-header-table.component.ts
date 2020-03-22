import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// One - Services
import { TableInfo } from './table-info.interface';
import { UserRole } from '../../../core/models/authentication';
import { CommonService } from '@one-core/service/common.service';

@Component({
  selector: 'one-admin-frozen-header-table',
  templateUrl: './frozen-header-table.component.html',
  styleUrls: ['./frozen-header-table.component.scss']
})
export class FrozenHeaderTableComponent implements OnInit {

  @Input() noAction = false;
  @Input() data: Array<any> = [];
  @Input() info: Array<TableInfo> = [];
  @Input() footerData: Array<any> = [];
  @Input() footerInfo: Array<TableInfo> = [];
  @Input() customTableClass: string;
  @Input() isTableScroller = true;
  @Input() isUserTable = false;
  @Input() toLocale = false;
  @Input() isPeopleTable: boolean;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() itemSelect: EventEmitter<any> = new EventEmitter();
  @Output() toggleSwitch: EventEmitter<{ isEnabled: boolean, data: any }> = new EventEmitter();
  @Output() toggleSwitchFeature: EventEmitter<{ isEnabled: boolean, data: any }> = new EventEmitter();
  displayOnEditLink: string;
  UserRole = UserRole;

  currentUserId = '';

  constructor(
    private library: FaIconLibrary,
    private commonService: CommonService
  ) {
    this.library.addIcons(faSpinner);
  }

  ngOnInit(): void {
    if (this.isPeopleTable) {
      this.displayOnEditLink = 'none';
    }
    this.currentUserId = this.commonService.userId;
    this.info.map(x => {
      const res = x.name.split('.');
      if (res.length > 1) {
        x.subFields = res;
      }
    });
  }

  toggleUiSwitch(e, dataItem): void {
    this.toggleSwitch.emit({isEnabled: e, data: dataItem});
  }

  toggleUiSwitchFeature(e, dataItem): void {
    this.toggleSwitchFeature.emit({isEnabled: e, data: dataItem});
  }

  isObject(value): boolean {
    return typeof value === 'object';
  }
}
