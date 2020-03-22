import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { UserRole } from '../../../../core/models/authentication';
import { CellType, ExpansionTableColumnInfo } from '@one-common/ui-kit/expansion-table/expansion-table.component';
import { Asset } from '@one-core/service/assets.service';

@Component({
  selector: 'one-admin-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.scss']
})
export class AssetsTableComponent implements OnInit {

  @Input() assets: Asset[];
  @Input() searchKey: string;
  @Output() editAsset: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteAsset: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('assetsName', {static: true}) assetsName;
  @ViewChild('peopleIdentifiers', {static: true}) peopleIdentifiers;
  @ViewChild('peopleGroups', {static: true}) peopleGroups;
  displayColumns: ExpansionTableColumnInfo[] = [];
  UserRole = UserRole;

  constructor() {
  }

  ngOnInit() {

    this.displayColumns = [
      {
        name: 'name', label: 'Assets Name', width: '23%',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.assetsName}
      },
      {
        name: 'typeId', label: 'Type', width: '', classes: 'full',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'siteId', label: 'Site', width: '16%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'areaId', label: 'Area', width: '16%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'zoneId', label: 'Zone', width: '16%',
        header: {type: CellType.default},
        content: {type: CellType.default}
      },
      {
        name: 'createdDate', label: 'Created', width: '80px',
        header: {type: CellType.default},
        content: {type: CellType.date}
      },
    ];
  }

}
