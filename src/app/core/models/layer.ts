export interface Layer {
  id?: number;
  name?: string;
  description?: string;
  address?: any;
  tenantKey?: string;
  typeId?: number;
  typeValue?: string;
  childrenCount?: number;
  parentName?: string;
  parentId: number;
  metaData?: any;
}

export interface LayerDetail extends Layer {
  metaData?: any;
}

export enum LayerCategory {
  Site = 'site',
  Area = 'area',
  Zone = 'zone'
}
