import { Component, OnDestroy, OnInit } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { Action } from '@one-core/model';
import { TypesService } from '@one-core/service/types.service';
import { DataMetaData } from '@one-core/service/action.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetadataService } from '@one-core/service/metadata.service';
import { ActionStateService, FilteredMetaData, IMetaDataUI } from '../../services/action-state.service';

export enum View {
  StringView = 'string',
  NumberView = 'number',
  DateView = 'date'
}

@Component({
  selector: 'one-admin-action-meta-data',
  templateUrl: './action-meta-data.component.html',
  styleUrls: ['./action-meta-data.component.scss']
})
export class ActionMetaDataComponent implements OnInit, OnDestroy {

  stepInfo: any = {};
  actionMetaDataForm: FormGroup;
  metaData: Array<IMetaDataUI> = [];
  operators: Array<IMetaDataUI> = [];
  values: Array<IMetaDataUI> = [];
  filteredMetaData: Array<FilteredMetaData> = [];
  metaDataConditions: Array<{ key: string, value: string, operator: any, type?: string, isDate?: boolean }> = [{key: '', value: '', operator: null, type: ''}];
  keyMetaData: string;
  operatorMetaData: any;
  operatorValueMetaData: string;
  valueMetaData: string;
  childrenTypeId: number;
  metaDataKeysType: any;
  View = View;
  currentViewValue: View = View.StringView;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public stateService: ActionStateService,
    public typesService: TypesService,
    public metadataService: MetadataService,
  ) {
  }

  private static _capitalizeFirstLetter(string): string {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  private static _findOperator(operator): string {
    if (+operator === 0 || +operator === 176 || operator === 'Equal') {
      return 'Equal';
    } else if (+operator === 1 || +operator === 177 || operator === 'Less Than') {
      return 'Less Than';
    } else if (+operator === 2 || +operator === 178 || operator === 'Greater Than') {
      return 'Greater Than';
    } else if (+operator === 3 || +operator === 179 || operator === 'Less Than Equal') {
      return 'Less Than Equal';
    } else if (+operator === 4 || +operator === 180 || operator === 'Greater Than Equal') {
      return 'Greater Than Equal';
    } else if (+operator === 5 || +operator === 181 || operator === 'Not Equal') {
      return 'Not Equal';
    } else if (+operator === 6 || +operator === 182 || operator === 'Contains') {
      return 'Contains';
    }
  }

  async ngOnInit(): Promise<void> {
    this.initActionNameForm(this.stateService.action);
    this.metaDataConditions.splice(0, 1);
    this.metadataService.getMetadataKeys(this.stateService.action.identifierTypeId)
      .subscribe(
        resp => {
          this.metaData = resp.data;
          //  this.metaData.push({id: 5, value: 'Date', type: 3});
        }, error => console.error(error)
      );
    if (this.stateService.action.conditions && !this.stateService.isEditModal) {
      this.stateService.action.conditions.map((item) => {
        if (item.key !== '') {
          this.setFilteredMetaData(item);
          this.setMetaDataConditions(item);
        }
      });
    }
    if (+this.stateService.action.identifierTypeId === 67) {
      // this.metaData = this.stateService.metaData;
      //  this.operators = this.stateService.operatorsWords;
      //  this.values = this.stateService.operatorsMake;
    }
    if (this.stateService.isEditModal && this.stateService.action.conditions) {
      this.stateService.action.conditions.map((item) => {
        this.setFilteredMetaData(item);
        this.setMetaDataConditions(item);
        this.metaData.map((itm) => {
          if (item.key === itm.value.toLocaleLowerCase()) {
            this.keyMetaData = itm.value.toLocaleLowerCase();
          }
        });
        this.values.map((itm) => {
          if (itm.value.toLocaleLowerCase() === item.value) {
            this.valueMetaData = itm.value.toLocaleLowerCase();
          }
        });
      });
    }
    if (!this.stateService.isEditModal) {
      //  this.disableEnableSelectMetaData(this.metaData);
    }
    this.actionMetaDataForm.get('value').disable();
    this.actionMetaDataForm.get('operator').disable();
    this.subscriptions.push(
      this.actionMetaDataForm.get('metaData').valueChanges.subscribe(value => {
        if (value) {
          this.operators = [];
          this.metaData.map((item) => {
            if (item.value === value) {
              this.childrenTypeId = item.id;
              this.metaDataKeysType = item.type;
            }
          });
          this.actionMetaDataForm.get('value').setValue('-1');
          this.valueMetaData = null;
          this.keyMetaData = value;
          this._setOperatorsData(this.metaDataKeysType);
          this.actionMetaDataForm.get('operator').enable();
          if (this.metaDataKeysType === 0) {
            this.currentViewValue = View.StringView;
            this.metadataService.getMetadataValues(value)
              .subscribe(data => {
                if (data.data.length > 0) {
                  this._setValueData(data.data);
                } else {
                  this.values = [];
                }
              });
          } else if (this.metaDataKeysType === 1 || this.metaDataKeysType === 2) {
            this.currentViewValue = View.NumberView;
            this.valueMetaData = null;
          } else if (this.metaDataKeysType === 3) {
            this.currentViewValue = View.DateView;
          }
        }
      }));
    this.subscriptions.push(
      this.actionMetaDataForm.get('operator').valueChanges.subscribe(id => {
        if (+id > 0) {
          this.actionMetaDataForm.get('value').enable();
          this.operators.map((item) => {
            if (item.id === +id) {
              this.operatorValueMetaData = item.value;
              this.operatorMetaData = id;
            }
          });
          // this.setOperatorMetaData(+id);
        }
      }));
    this.subscriptions.push(
      this.actionMetaDataForm.get('value').valueChanges.subscribe(id => {
        if (+id > 0) {
          this.values.map((item) => {
            if (+id === item.id) {
              this.valueMetaData = item.value;
            }
          });
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  initActionNameForm(action?: Action): void {
    this.actionMetaDataForm = this.formBuilder.group({
      metaData: [this.stateService.isEditModal ? '-1' : action.metaData.key || '-1', Validators.required],
      operator: [this.stateService.isEditModal ? '-1' : action.metaData.operator || '-1', Validators.required],
      value: [this.stateService.isEditModal ? '-1' : action.metaData.value || '-1', Validators.required],
    });
  }

  save(): void {
    this.metaDataConditions.map((item) => {
      item.value = item.value.toString();
      //  item.key = item.key.toLocaleLowerCase();
      //  item.value = item.value.toLocaleLowerCase();
    });
    this.stateService.changeStep(this.stepInfo.next);
    this.stateService.saveMetaDataForm(this.metaDataConditions);
  }

  addMetaData(): void {
    this.metaDataConditions.push({key: this.keyMetaData, type: this.metaDataKeysType, operator: this.operatorValueMetaData, value: this.valueMetaData, isDate: this.currentViewValue === View.DateView});
    this.filteredMetaData.push({metaData: this.keyMetaData, type: this.metaDataKeysType, operator: this.operatorValueMetaData, value: this.valueMetaData, isDate: this.currentViewValue === View.DateView});
  }

  disableEnableSelectMetaData(metaData: Array<IMetaDataUI>): void {
    if (metaData) {
      this.actionMetaDataForm.get('metaData').enable();
    } else {
      this.actionMetaDataForm.get('metaData').disable();
    }
  }

  removeFromList(index, item): void {
    this.filteredMetaData.splice(index, 1);
    this.metaDataConditions.splice(index, 1);
  }

  setFilteredMetaData(item): void {
    const operator: any = item.operator;
    this.filteredMetaData.push(
      {
        isDate: item.isDate ? item.isDate : null,
        type: item.type,
        metaData: ActionMetaDataComponent._capitalizeFirstLetter(item.key),
        operator: ActionMetaDataComponent._findOperator(operator === typeof 123 ? +item.operator : item.operator),
        value: ActionMetaDataComponent._capitalizeFirstLetter(item.value)
      });
  }

  setMetaDataConditions(item): void {
    const operator: any = item.operator;
    this.metaDataConditions.push({key: item.key, type: item.type, operator: ActionMetaDataComponent._findOperator(operator === typeof 123 ? +item.operator : item.operator), value: item.value});
  }

  changeSingleFilter(e): void {
    if (e) {
      this.valueMetaData = null;
      this.valueMetaData = e;
    }
  }

  private _setValueData(data: Array<DataMetaData>): void {
    this.values = [];
    data.map((item, index) => {
      this.values[index] = {id: item.id, value: item.value};
    });
  }

  private _setOperatorsData(id: number): void {
    if (id === 0 || id === 3) {
      this.stateService.operatorsString.map((item) => {
        this.operators.push(item);
      });
    } else if (id === 1 || id === 2) {
      this.stateService.operatorsNumber
        .map((item) => {
          this.operators.push(item);
        });
    }
  }
}
