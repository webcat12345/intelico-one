import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export interface Alphabet {
  id: number;
  value: string;
}

@Component({
  selector: 'one-admin-people-alphabet-filter',
  templateUrl: './widget-admin-people-alphabet-filter.component.html',
  styleUrls: ['./widget-admin-people-alphabet-filter.component.scss']
})
export class WidgetAdminPeopleAlphabetFilterComponent implements OnInit {

  // tslint:disable-next-line
  alphabet: Array<Alphabet> = [{id: 1, value: 'All'}, {id: 2, value: 'A'}, {id: 3, value: 'B'}, {id: 4, value: 'C'}, {id: 5, value: 'D'}, {id: 6, value: 'E'}, {id: 7, value: 'F'}, {id: 8, value: 'G'}, {id: 9, value: 'H'}, {id: 10, value: 'I'}, {id: 11, value: 'J'}, {id: 12, value: 'K'}, {id: 13, value: 'L'}, {id: 14, value: 'M'}, {
    id: 15,
    value: 'N'
    // tslint:disable-next-line
  }, {id: 16, value: 'O'}, {id: 17, value: 'P'}, {id: 18, value: 'Q'}, {id: 19, value: 'R'}, {id: 20, value: 'S'}, {id: 21, value: 'T'}, {id: 22, value: 'U'}, {id: 23, value: 'V'}, {id: 24, value: 'W'}, {id: 25, value: 'X'}, {id: 26, value: 'Y'}, {id: 27, value: 'Z'}];
  @Output() filterByFirstName: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  filterByFirstNamePeople(e) {
    this.filterByFirstName.emit(e);
  }

}
