import { IdentifierType, Priority } from '@one-core/model';

export interface HubLocationDetail {
  country: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postCode: string;
  latitude: number;
  longitude: number;
  zoneId: number;
  zone: string;
  areaId: number;
  area: string;
  siteId: number;
  site: string;
}

export interface INotificationActionReason {
  id: number;
  description: string;
}

export interface Notification {
  id?: string;
  priority?: Priority;
  identifier?: string;
  createdAt?: string;
  reason?: string;
  peopleId?: string;
  name?: string;
  actionName?: string;
  actionReason?: INotificationActionReason;
  source?: string;
  sourceType?: string;
  location?: string;
  eventId?: string;
  actionId?: string;
  identifierTypeId?: IdentifierType;
  identifierType?: string;
  tenantKey?: string;
  locationDetails?: HubLocationDetail;
}

export interface NotificationAlert extends Notification {
  timeElapsed: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  count: number;
}
