import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { ActionService } from '@one-core/service/action.service';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';
import { ActionTriggerType } from '@one-core/model';

export enum ActionSearchType {
  Identifier = 'identifier',
  ActionName = 'action-name'
}

@Component({
  selector: 'one-admin-action-filter',
  templateUrl: './action-filter.component.html',
  styleUrls: ['./action-filter.component.scss']
})
export class ActionFilterComponent {

  @ViewChild(SearchKeyFilterComponent, {static: false}) searchKeyFilter: SearchKeyFilterComponent;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  queries = ['', '', '', ''];

  searchType: ActionSearchType = ActionSearchType.Identifier;

  triggerOptions = [
    {value: `'Enter'`, name: 'enter', label: 'Enter'},
    {value: `'Exit'`, name: 'exit', label: 'Exit'},
  ];

  actionOptions = [
    {value: `'${ActionTriggerType.Email}'`, name: 'email', label: 'Email'},
    {value: `'${ActionTriggerType.SMS}'`, name: 'sms', label: 'SMS'},
    {value: `'${ActionTriggerType.Phone}'`, name: 'call', label: 'Phone Call'},
    {value: `'${ActionTriggerType.Whatsapp}'`, name: 'whatsapp', label: 'WhatsApp'},
    {value: `'${ActionTriggerType.Sidebar}'`, name: 'sidebar', label: 'Sidebar'},
  ];

  constructor(
    private actionService: ActionService
  ) {
  }

  async searchKeyChange(e): Promise<void> {
    if (this.searchType === ActionSearchType.Identifier) {
      const res: Array<any> = await this.actionService.getActionIdentifier(e).toPromise() as Array<any>;
      const ids = res.map(item => `id eq ${item.actionId}`);
      const filters = ids.join(' or ');
      if (e) {
        this.queries[0] = filters ? filters : 'id eq null';
      } else {
        this.queries[0] = '';
      }
    } else {
      if (e) {
        this.queries[0] = e.replace('identifier', 'name');
      } else {
        this.queries[0] = '';
      }
    }
    this.filterChanged();
  }

  triggerChange(e): void {
    this.queries[1] = e;
    this.filterChanged();
  }

  actionChange(e): void {
    this.queries[2] = e;
    this.filterChanged();
  }

  filterChanged(): void {
    this.changeFilter.emit(this.queries.filter(x => x).join(' and '));
  }

  searchByIdentifier(identifier): void {
    this.searchKeyFilter.search(identifier);
  }

  changeSearchType(e): void {
    this.queries[0] = 'none';
  }

}
