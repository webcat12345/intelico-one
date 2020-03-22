export enum InternalNotificationType {
  Alert = 'alert',
  Success = 'success',
  Warning = 'warning',
  Update = 'update',
  Error = 'error'
}

export interface InternalNotification {
  type: InternalNotificationType;
  message: string;
}

export enum LoaderType {
  Default = 0,
  Ball = 1
}

export interface ClusterMapItem {
  siteId: number;
  total: number;
  site: string;
  area?: string;
  zone?: string;
  sourceName?: string;
  lat: number;
  long: number;
}
