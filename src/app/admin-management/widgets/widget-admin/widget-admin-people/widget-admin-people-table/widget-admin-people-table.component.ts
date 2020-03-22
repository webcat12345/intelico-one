import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
// One - Services
import { IPeople } from '@one-core/service/people.service';
import { UserRole } from '../../../../../core/models/authentication';
import { CellType, ExpansionTableColumnInfo } from '@one-common/ui-kit/expansion-table/expansion-table.component';

@Component({
  selector: 'one-admin-people-table',
  templateUrl: './widget-admin-people-table.component.html',
  styleUrls: ['./widget-admin-people-table.component.scss']
})
export class WidgetAdminPeopleTableComponent implements OnInit, OnChanges {

  @Input() listPeople: IPeople[];
  @Input() searchKey: string;
  @Output() editPerson: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletePerson: EventEmitter<any> = new EventEmitter<any>();
  @Output() listPeopleLength: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('peopleIconAndFullName', {static: true}) peopleIconAndFullName;
  @ViewChild('peopleAddress', {static: true}) peopleAddress;
  @ViewChild('peopleIdentifiers', {static: true}) peopleIdentifiers;
  @ViewChild('peopleGroups', {static: true}) peopleGroups;
  @ViewChild('peopleProducts', {static: true}) peopleProducts;
  displayColumns: ExpansionTableColumnInfo[] = [];
  UserRole = UserRole;

  constructor() {
  }

  ngOnInit() {
    this.displayColumns = [
      {
        name: 'peopleInfo', label: 'Full Name', width: '22%',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.peopleIconAndFullName}
      },
      {
        name: 'address', label: 'Email', classes: 'full',
        header: {type: CellType.default},
        content: {type: CellType.template, templateRef: this.peopleAddress}
      },
      {
        name: 'products', label: 'Products', width: '75px',
        header: {type: CellType.default},
        content: {type: CellType.secondLevel, templateRef: this.peopleProducts},
        value: 'value'
      },
      {
        name: 'identifiers', label: 'Identifiers', width: '85px',
        header: {type: CellType.default},
        content: {type: CellType.secondLevel, templateRef: this.peopleIdentifiers},
        value: 'value'
      },
      {
        name: 'groups', label: 'Groups', width: '64px',
        header: {type: CellType.default},
        content: {type: CellType.secondLevel, templateRef: this.peopleGroups},
        value: 'name'
      },
      {
        name: 'createdDate', label: 'Created', width: '85px',
        header: {type: CellType.default},
        content: {type: CellType.date}
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.listPeopleLength.emit(this.listPeople.length);
    }, 100);
  }
}
