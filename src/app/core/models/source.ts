import { Layer } from '@one-core/model';
import { IType } from '@one-core/service/alert.service';

export interface Source {
  id: number;
  tenantKey: string;
  name: string;
  description: string;
  zoneId: number;
  zone: Layer;
  type: IType;
  identifierTypeId: number;
  identifierType: IType;
  key: string;
  createdDate: string;
  modifiedDate: string;
  isDeleted: boolean;
}
