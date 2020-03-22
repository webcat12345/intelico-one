import { HubLocationDetail } from '@one-core/model';

export enum NotificationStatus {
  New = 100,
  Resolved = 200
}

export enum Priority {
  Normal = 200,
  High = 300,
  Critical = 400
}

export enum HistoryItemType {
  Event = 1,
  Notification = 2,
  Action = 3
}

// TODO: important, identifier type value is hard coded on UI Side
export enum IdentifierType {
  Numberplate = 67,
  Bluetooth = 122,
  Face = 121,
  Container = 120,
  Video = 132,
  Device = 141,
  InputSwitched = 140,
  Barcode = 147,
  QRCode = 148,
  Temperature = 159,
  RFID = 284,
}

export interface Event {
  id: string;
  source: string;
  peopleId?: string;
  name: string;
  action?: string;
  nameAction?: string;
  reason?: string;
  actionReason?: string;
  identifierType?: string;
  type?: string;
  sourceDetails?: any;
  personDetails?: any;
  triggerCondition?: string;
  identifier: string;
  identifierTypeValue?: string;
  identifierId: string;
  location: string;
  createdAt?: string;
  tenantKey: string;
  possibleActions?: Array<string>;
}

export interface EventListItem extends Event {
  lat: number;
  long: number;
  receivedOn: string;
  pictureUrl: string;
  site: string;
  siteId: number;
  area: string;
  areaId: number;
  zone: string;
  zoneId: number;
  historyItemType: HistoryItemType;
  historyItemSource: number;
  triggerCondition: string;
  motion: false;

  showDetail?: boolean;
}

export interface LocationDetails {
  linecountry?: string;
  country?: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postCode: string;
  area?: string;
  site?: string;
  zone?: string;
  latitude: number;
  longitude: number;
  zoneId: number;
  createdAt?: string;
}

export interface EventDetail extends Event {
  pictureUrl: string;
  agentId: string;
  actionId?: string;
  receivedAt: string;
  resolvedComment?: string;
  identifierOwnerFirstName?: string;
  metaData: any;
  latitude: number;
  longitude: number;
  zoneId: number;
  ticketNumber: string;
  transaction: any;
  locationDetails?: LocationDetails;
}

export interface NotificationListItem extends Event {
  eventId: string;
  actionId: string;
  reason: string;
  peopleId?: string;
  priority: Priority;
  status: NotificationStatus;
  comment?: string;

  site: string;
  siteId: number;
  area: string;
  areaId: number;
  zone: string;
  zoneId: number;

  identifierType: string;
  identifierTypeId: number;
  resolvedOn: string;

  expanded?: boolean;
  lat?: number; // backend returns this as a string
  long?: number; // backend returns this as a string
}

export interface Reason {
  id: string;
  description: string;
}

export interface Resolve {
  reason: Reason;
  comment: string;
}

export interface NotificationItemViewModel extends NotificationListItem {
  resolveReason: string;
  resolve?: Resolve;
  showDetail?: boolean;
  showResolveForm?: boolean;
}

export interface SourceDetail {
  id: number;
  name: string;
  type: string;
  typeId: number;
}

export interface EventHub {
  agentId: string;
  receivedAt: string;
  createdAt: string;
  identifier: string;
  pictureUrl: string;
  identifierId: string;
  identifierOwnerFirstName: string;
  name: string;
  peopleId: string;
  location: string;
  latitude: number;
  longitude: number;
  source: string;
  sourceDetails: SourceDetail;
  triggerCondition: string;
  tenantKey: string;
  transaction: string;
  ticketNumber: string;
  identifierTypeId: number;
  identifierTypeValue: string;
  id: string;
  locationDetails: HubLocationDetail;
  possibleActions: any[];
}
