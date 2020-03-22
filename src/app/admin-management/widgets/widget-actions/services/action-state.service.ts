import { Injectable } from '@angular/core';

import { delay, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { LayerService } from '@one-core/service/layer.service';
import { ActionService } from '@one-core/service/action.service';
import { Action, ActionDate, ActionReason, ActionTrigger, LayerCategory } from '@one-core/model';
import { comparer } from '../../../../core/utils/common.util';

export enum ActionStep {
  Splash = 0,
  ActionName,
  ActionIdentifier,
  ActionMetaData,
  ActionTime,
  ActionTimeForm,
  ActionLocation,
  ActionLocationForm,
  ActionAlertSetting,
  ActionOutput,
  ActionRecipients,
  IdentifierForm
}

export interface IdentifiersOrMetadata {
  id: boolean;
  metaData: boolean;
}

export interface IMetaDataUI {
  id: number;
  value: string;
  type?: number;
}

export interface FilteredMetaData {
  metaData: string;
  operator: string;
  value: string;
  type?: string;
  isDate?: boolean;
}

@Injectable()
export class ActionStateService {

  action: Action = {
    type: 'vehicle',
    dates: [],
    identifiers: [],
    triggers: [],
    teams: [],
    locations: [],
    actionReason: {id: '', description: ''},
    metaData: {key: '', operator: '', value: ''},
    conditions: [{key: '', type: '', value: '', operator: ''}]
  };

  changeStep$: Subject<any> = new Subject<any>();
  identifiersOrMetadata$: BehaviorSubject<IdentifiersOrMetadata> = new BehaviorSubject<IdentifiersOrMetadata>({id: null, metaData: null});
  closeSidebar$: Subject<any> = new Subject<any>();
  actionCreated$: Subject<any> = new Subject<any>();

  weekdays = [
    {id: 'chbMonday', label: 'Mon', value: 'Mon'},
    {id: 'chbTuesday', label: 'Tue', value: 'Tues'},
    {id: 'chbWednesday', label: 'Wed', value: 'Wed'},
    {id: 'chbThursday', label: 'Thu', value: 'Thr'},
    {id: 'chbFriday', label: 'Fri', value: 'Fri'},
    {id: 'chbSaturday', label: 'Sat', value: 'Sat'},
    {id: 'chbSunday', label: 'Sun', value: 'Sun'},
  ];
  metaData = [
    {id: 170, value: 'Colour'},
    {id: 171, value: 'Make'},
    {id: 172, value: 'Model'},
    {id: 173, value: 'CO2 (g/km)'},
    {id: 174, value: 'Fuel Type'},
    {id: 175, value: 'Engine CC'},
  ];

  operators = [
    {id: 176, value: '='},
    {id: 177, value: '<'},
    {id: 178, value: '>'},
    {id: 179, value: '<='},
    {id: 180, value: '>='},
    {id: 181, value: '<>'},
  ];

  operatorsNumber = [
    {id: 176, value: 'Equal'},
    {id: 177, value: 'Less Than'},
    {id: 178, value: 'Greater Than'},
    {id: 179, value: 'Less Than Equal'},
    {id: 180, value: 'Greater Than Equal'},
    {id: 181, value: 'Not Equal'},
    {id: 182, value: 'Contains'},
  ];

  operatorsString = [
    {id: 176, value: 'Equal'},
    {id: 181, value: 'Not Equal'},
    {id: 182, value: 'Contains'},
  ];

  types = [
    {name: 'Vehicle', value: 'vehicle', active: false},
    {name: 'Person', value: 'people', active: false},
    {name: 'Device', value: 'device', active: false},
    // {className: 'asset-btn', name: 'Asset', value: 'asset', active: false},
  ];

  layers = {
    sites: [], areas: [], zones: []
  };

  isEditModal = false;
  identifiersOrMetadata: IdentifiersOrMetadata;

  constructor(
    private actionService: ActionService,
    private layerService: LayerService
  ) {
  }

  private static _lowerCaseFirstLetter(string): string {
    return `${string[0].toLowerCase()}${string.slice(1)}`;
  }

  async getLayers(): Promise<void> {
    try {
      this.layers.sites = await this.layerService.getLayers(LayerCategory.Site).pipe(map((x: any) => x.data)).toPromise();
      this.layers.areas = await this.layerService.getLayers(LayerCategory.Area).pipe(map((x: any) => x.data)).toPromise();
      this.layers.zones = await this.layerService.getLayers(LayerCategory.Zone).pipe(map((x: any) => x.data)).toPromise();
    } catch (e) {
      throw (e);
    }
  }

  getFullLayerFormat(id) {
    // search from the zone list first
    let zoneRes = null;
    let areaRes = null;
    let siteRes = null;
    zoneRes = this.layers.zones.find(x => +x.id === +id);
    if (zoneRes) {
      areaRes = this.layers.areas.find(x => x.id === zoneRes.parentId);
      siteRes = this.layers.sites.find(x => x.id === areaRes.parentId);
      return {site: siteRes, area: areaRes, zone: zoneRes};
    }
    areaRes = this.layers.areas.find(x => +x.id === +id);
    if (areaRes) {
      siteRes = this.layers.sites.find(x => x.id === areaRes.parentId);
      return {site: siteRes, area: areaRes, zone: {id: -1, name: 'All'}};
    }
    siteRes = this.layers.sites.find(x => +x.id === +id);
    if (siteRes) {
      return {site: siteRes, area: {id: -1, name: 'All'}, zone: {id: -1, name: 'All'}};
    }
    return {site: {id: -1, name: 'All'}, area: {id: -1, name: 'All'}, zone: {id: -1, name: 'All'}};
  }

  getLayerType(id): number {
    if (this.layers.sites.findIndex(x => +x.id === +id) > -1) {
      return 1;
    } else if (this.layers.areas.findIndex(x => +x.id === +id) > -1) {
      return 2;
    } else if (this.layers.zones.findIndex(x => +x.id === +id) > -1) {
      return 3;
    } else {
      return -1;
    }
  }

  closeSidebar(): void {
    this.closeSidebar$.next(true);
  }

  changeStep(stepInfo): void {
    this.changeStep$.next(stepInfo);
  }

  changeIdentifiersOrMetadata(identifiersOrMetadata: IdentifiersOrMetadata): void {
    this.identifiersOrMetadata = identifiersOrMetadata;
    this.identifiersOrMetadata$.next(identifiersOrMetadata);
  }

  saveIdentifiers(identifiers): void {
    this.action.identifiers = identifiers;
  }

  saveLocations(locations): void {
    this.action.locations = locations;
  }

  saveNameForm(action: Action): void {
    this.action.name = action.name;
    this.action.description = action.description;
    this.action.type = action.type;
    this.action.identifierTypeId = action.identifierTypeId;
    this.action.identifierType = action.identifierType;
    if (action.typeTrigger) {
      this.action.typeTrigger = action.typeTrigger;
    } else {
      delete this.action.typeTrigger;
    }
  }

  saveMetaDataForm(metaData): void {
    this.action.conditions = metaData;
  }

  saveNotificationTriggerForm(action: Action, actionReason: ActionReason): void {
    const webhook = this.action.triggers.find((trigger) => trigger.name === 'webhook');
    this.action.triggers = action.triggers;
    if (webhook) {
      this.action.triggers.push(webhook);
    }
    this.action.priority = action.priority;
    this.action.actionReason = actionReason;
  }

  saveOutputForm(actionTrigger: ActionTrigger): void {
    if (!this.action.triggers) {
      this.action.triggers = [];
    }
    this.action.triggers = this.action.triggers.filter((trigger) => trigger.name !== 'webhook');
    this.action.triggers.push(actionTrigger);
  }

  removeOutputForm(): void {
    this.action.triggers.map((trigger, index) => {
      if (trigger.name === 'webhook') {
        this.action.triggers.splice(index, 1);
      }
    });
  }

  getWebhook(): ActionTrigger {
    if (this.action.triggers && this.action.triggers.length) {
      return this.action.triggers.find((trigger) => trigger.name === 'webhook');
    } else {
      return null;
    }
  }

  addDateRule(rule: ActionDate) {
    if (this.action.dates) {
      this.action.dates.push(rule);
    } else {
      this.action.dates = [];
    }
  }

  saveAction(): Observable<any> {
    if (this.identifiersOrMetadata.id) {
      delete this.action.conditions;
    }
    if (this.action.conditions) {
      this.action.conditions.map((item) => {
        item.operator = ActionStateService._lowerCaseFirstLetter(item.operator);
        item.operator = item.operator.replace(/\s/g, '');
        delete item.isDate;
      });
    }
    return this.actionService.createAction(this.action)
      .pipe(
        delay(6000),
        tap(e => {
          this.actionCreated$.next(e);
          this.resetActionStore();
        })
      );
  }

  async getActionById(): Promise<void> {
    try {
      const action: any = this.action;
      const res: any = await this.actionService.getActionById(action.id).toPromise();
      this.action = this.decorateActionObject(res);
    } catch (e) {
      throw e;
    }
  }

  editAction(): Observable<any> {
    if (this.action.conditions) {
      this.action.conditions.map((item) => {
        item.operator = ActionStateService._lowerCaseFirstLetter(item.operator);
        item.operator = item.operator.replace(/\s/g, '');
        delete item.isDate;
      });
    }
    return this.actionService.editAction(this.action.id, this.action)
      .pipe(
        delay(6000),
        tap(e => {
          this.actionCreated$.next(e);
          this.resetActionStore();
        })
      );
  }

  updateIdentifiers(newIds, oldIds): Observable<any> {
    const diff = this.getDiff(newIds, oldIds);
    const data = {
      newIdentifiers: diff.added,
      removeIdentifiers: diff.removed
    };
    return this.actionService.updateIdentifiers(this.action.id, data);
  }

  resetActionStore(): void {
    this.action = {type: 'vehicle', dates: [], identifiers: [], triggers: [], metaData: {key: '', operator: '', value: ''}, conditions: [{key: '', operator: '', value: '', type: ''}]};
  }

  getDiff(newArray, oldArray) {
    const added = newArray.filter(comparer(oldArray));
    const removed = oldArray.filter(comparer(newArray));
    return {removed, added};
  }

  decorateActionObject(obj: any) {
    if (obj.type) {
      obj.type = this.types[obj.type - 1].value;
    }
    if (obj.dates) {
      obj.dates.map(x => {
        x.days = x.days.map(n => {
          if (n > 1) {
            return this.weekdays[n - 1].value;
          } else {
            return 'All';
          }
        });
      });
    }
    return obj;
  }
}
