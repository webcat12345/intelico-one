import { EventHub, EventListItem, Notification, NotificationItemViewModel, NotificationStatus } from '@one-core/model';

export enum HubConnectionName {
  Notification = 'notifications',
  History = 'histories',
  Update = 'updates'
}

export enum HubConnectionType {
  History = 'history',
  Notification = 'notification',
  Update = 'update'
}

export interface HubData {
  type: HubConnectionType;
  data: any;
}

export function encodeHubData(type: HubConnectionType, data): HubData {
  return {
    type,
    data
  };
}

export function getActivityFromHistoryHub(data: EventHub): EventListItem {
  return {
    id: data.id,
    source: data.source,
    peopleId: data.peopleId,
    name: data.name,
    identifier: data.identifier,
    identifierId: data.identifierId,
    location: data.location,
    createdAt: data.createdAt,
    tenantKey: data.tenantKey,
    lat: data.latitude,
    long: data.longitude,
    receivedOn: data.receivedAt,
    pictureUrl: data.pictureUrl,
    site: data.locationDetails.site,
    siteId: data.locationDetails.siteId,
    area: data.locationDetails.area,
    areaId: data.locationDetails.areaId,
    zone: data.locationDetails.zone,
    zoneId: data.locationDetails.zoneId,
    historyItemType: null,
    historyItemSource: data.identifierTypeId,
    triggerCondition: data.triggerCondition,
    motion: false,
    showDetail: false,
  };
}

export function getNotificationFromSocketData(data: Notification): NotificationItemViewModel {
  return {
    id: data.id,
    source: data.source,
    name: data.name,
    identifier: data.identifier,
    identifierId: data.identifier,
    location: data.location,
    createdAt: data.createdAt,
    tenantKey: data.tenantKey,
    eventId: data.eventId,
    actionId: data.actionId,
    reason: data.reason,
    priority: data.priority,
    peopleId: data.peopleId,
    actionReason: data.actionReason.description,
    identifierType: data.identifierType,
    identifierTypeId: data.identifierTypeId,
    site: data.locationDetails.site,
    siteId: data.locationDetails.siteId,
    zone: data.locationDetails.zone,
    zoneId: data.locationDetails.zoneId,
    area: data.locationDetails.area,
    areaId: data.locationDetails.areaId,
    lat: data.locationDetails.latitude,
    long: data.locationDetails.longitude,
    status: NotificationStatus.New,
    resolveReason: '',
    resolvedOn: ''
  };
}

export function lineSeparator(type: HubConnectionType): any {
  if (type === HubConnectionType.Notification) {
    return {
      id: null,
      source: null,
      name: null,
      identifier: null,
      identifierId: null,
      location: null,
      createdAt: null,
      tenantKey: null,
      eventId: null,
      actionId: null,
      reason: null,
      priority: null,
      identifierType: null,
      identifierTypeId: null,
      site: null,
      siteId: null,
      zone: null,
      zoneId: null,
      area: null,
      areaId: null,
      status: null,
      resolveReason: '',
      resolvedOn: ''
    };
  } else if (type === HubConnectionType.History) {
    return {
      id: null,
      source: '',
      name: '',
      identifier: '',
      identifierId: '',
      location: '',
      createdAt: '',
      tenantKey: '',
      lat: 0,
      long: 0,
      receivedOn: '',
      pictureUrl: '',
      site: '',
      siteId: 0,
      area: '',
      areaId: 0,
      zone: '',
      zoneId: 0,
      historyItemType: null,
      historyItemSource: 0,
      triggerCondition: '',
      motion: false,
      showDetail: false,
    };
  } else {
    return null;
  }
}
