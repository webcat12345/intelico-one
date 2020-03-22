import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { IdentifierType } from '@one-core/model';
import { IType } from '@one-core/service/types.service';
import { getIdentifierTypes } from '../../../../../../state/reducers';
import { ToastrService } from '../../../../../services/toastr.service';
import { IPeople, PeopleService } from '@one-core/service/people.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminPeopleStateService } from '../../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-identifiers-detail',
  templateUrl: './widget-admin-people-identifiers-detail.component.html',
  styleUrls: ['./widget-admin-people-identifiers-detail.component.scss']
})
export class WidgetAdminPeopleIdentifiersDetailComponent implements OnInit, OnDestroy {

  @Input() person: IPeople;
  @Input() isNew: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() closeAddModal: EventEmitter<boolean> = new EventEmitter();

  identifierTypes$ = this.store.pipe(select(getIdentifierTypes), map(types => types.filter(x => x.id !== IdentifierType.Video)));
  identifierTypes: Array<IType>;
  selectedIdentifierType: any;
  selectedIdentifierId: any;
  removeSelectedValue: string;
  removeSelectedId: number;
  removeSelectedIdentifierId: Array<number> = [];
  arraySelectedIdentifierId: Array<number> = [];
  identifier = '';
  showConfirmModal: boolean;

  info: Array<TableInfo> = [
    {label: '', name: 'typeName', width: '', isLink: false},
    {label: '', name: 'value', width: '', isLink: false},
    {label: '', name: 'action_group', width: '70px', isLink: false},
  ];

  data: Array<any> = [];
  dataIdentifiers: Array<any> = [];
  editDataIdentifiers: Array<any> = [];
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private toastr: ToastrService,
    private peopleService: PeopleService,
    public widgetAdminPeopleStateService: WidgetAdminPeopleStateService
  ) {
  }

  ngOnInit(): void {
    if (!this.isNew) {
      if (this.person.identifiers.newIdentifiers.length > 0 && this.person.identifiers.newIdentifiers[0].value !== '') {
        this.person.identifiers.newIdentifiers.map((item) => {
          this.data.push(item);
        });
      }
    }
    this.subscriptions.push(
      this.identifierTypes$.subscribe(
        types => {
          this.identifierTypes = types;
        }
      ));
    if (this.isNew) {
      if (this.person.peopleIdentifiers.length > 0) {
        this.identifierTypes.map((item) => {
          this.person.peopleIdentifiers.map((itm) => {
            if (item.id === itm.identifierTypeId) {
              this.data.push({value: itm.identifier, typeName: item.value, id: itm.id});
            }
          });
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  filterChanged(e): void {
    this.identifierTypes.map((item) => {
      if (+e === item.id) {
        this.selectedIdentifierType = item.value;
        this.selectedIdentifierId = item.id;
        this.arraySelectedIdentifierId.push(item.id);
      }
    });
  }

  addNewIdentifier(): void {
    this.data.push({value: this.identifier, typeName: this.selectedIdentifierType});
    this.dataIdentifiers.push({value: this.identifier, typeId: this.selectedIdentifierId, typeName: this.selectedIdentifierType});
    this.identifier = '';
    this.widgetAdminPeopleStateService.updatePerson(this.person);
    if (this.widgetAdminPeopleStateService.isUpdateIdentifiers) {
      if (this.data.length > 0) {
        this.editDataIdentifiers = [];
        this.identifierTypes.map((itm) => {
          this.data.map((item, index) => {
            if (itm.value === item.typeName) {
              this.editDataIdentifiers.push({value: item.value, typeId: itm.id});
            }
          });
        });
      }
      this.peopleService.setDataIdentifiers(this.editDataIdentifiers, this.removeSelectedIdentifierId);
    }
  }

  onRemove(e): void {
    if (this.isNew) {
      this.removeSelectedId = e.id;
    }
    this.selectedIdentifierId = e.typeName;
    this.removeSelectedValue = e.value;
    this.showConfirmModal = true;
    this.arraySelectedIdentifierId.map((item, index) => {
      if (item === e.id) {
        this.arraySelectedIdentifierId.splice(index, 1);
      }
    });
  }

  onDelete(e): void {
    if (e) {
      this.dataIdentifiers = [];
      this.data.map((item, index) => {
        if (this.removeSelectedId === item.id) {
          this.data.splice(index, 1);
        }
      });
      this.data.map((item, index) => {
        this.dataIdentifiers.push({value: item.value, typeId: item.typeId, typeName: item.typeName});
      });
      this.showConfirmModal = false;
      if (this.isNew && this.removeSelectedId) {
        this.removeSelectedIdentifierId.push(this.removeSelectedId);
        /*this.person.peopleIdentifiers.map((item) => {
          if (item.id === this.removeSelectedId) {
          }
        });*/
      }
    } else {
      this.showConfirmModal = false;
    }
  }

  nextStepPerson(): void {
    if (this.isNew) {
      if (this.data.length > 0) {
        this.identifierTypes.map((itm) => {
          this.data.map((item, index) => {
            if (itm.value === item.typeName) {
              this.editDataIdentifiers.push({value: item.value, typeId: itm.id});
            }
          });
        });
      }
      this.peopleService.setDataIdentifiers(this.editDataIdentifiers, this.removeSelectedIdentifierId);
    }
    if (!this.isNew) {
      this.person.identifiers.newIdentifiers = this.dataIdentifiers;
    }
    this.widgetAdminPeopleStateService.updateCountSteps(3);
    this.nextStep.emit('groups');
  }

  async editPerson(): Promise<void> {
    if (this.person.id) {
      await this.peopleService.createPeopleIdentifiers(this.person.id, this.peopleService.dataIdentifiers).toPromise();
      this.toastr.success('Successfully updated a identifier(s)');
      this.closeAddModal.emit(true);
      // this.widgetAdminPeopleStateService.updateReloadGetPeople(true);
    }
    this.closeAddModal.emit(true);
  }
}
