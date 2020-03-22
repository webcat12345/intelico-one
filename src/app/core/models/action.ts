import { IUser } from '@one-core/service/user.service';
import { ITeam } from '../../admin-management/widgets/widget-actions/sidebar-elements/action-recipients/action-recipients.component';

export enum ActionTriggerType {
  SMS = 'sms',
  Phone = 'call',
  Dashboard = 'dashboard',
  Sidebar = 'sidebar',
  Email = 'email',
  Voice = 'voice',
  Whatsapp = 'whatsapp'
}

export interface ActionTrigger {
  name?: string;
  metaData?: any;
}

export interface ActionDate {
  from?: string;
  to?: string;
  days?: string[];
}

export interface ActionIdentifier {
  value?: string;
}

export interface ActionReason {
  id: string;
  description: string;
}

export interface MetaData {
  key: string;
  value: string;
  operator: string;
  type?: string;
  isDate?: boolean;
}

export interface Action {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  identifiers?: ActionIdentifier[];
  identifierTypeId?: number;
  identifierType?: string;
  locations?: any[];
  dates?: ActionDate[];
  triggers?: ActionTrigger[];
  priority?: number;
  typeTrigger?: string;
  reason?: string;
  actionReason?: ActionReason;
  users?: IUser[];
  teams?: ITeam[];
  metaData: MetaData;
  conditions: Array<MetaData>;
}
