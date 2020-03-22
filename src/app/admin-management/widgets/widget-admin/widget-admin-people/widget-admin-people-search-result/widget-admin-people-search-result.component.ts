import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPeopleList } from '@one-core/service/people.service';

@Component({
  selector: 'one-admin-widget-admin-people-search-result',
  templateUrl: './widget-admin-people-search-result.component.html',
  styleUrls: ['./widget-admin-people-search-result.component.scss']
})
export class WidgetAdminPeopleSearchResultComponent implements OnInit {

  @Input() searchResult: IPeopleList;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSelectPeople(people) {
    this.close.emit({isNew: false, res: people});
  }

  onCreateNew() {
    this.close.emit({isNew: true, res: {firstName: this.searchResult.data[0].firstName, lastName: this.searchResult.data[0].lastName}});
  }

}
