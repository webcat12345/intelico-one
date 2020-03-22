import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IPeopleList, PeopleService } from '@one-core/service/people.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-people-search',
  templateUrl: './widget-admin-people-search.component.html',
  styleUrls: ['./widget-admin-people-search.component.scss']
})
export class WidgetAdminPeopleSearchComponent implements OnInit {

  @Output() close: EventEmitter<any> = new EventEmitter();

  firstName = '';
  lastName = '';

  isLoading = false;
  noMatch = false;

  constructor(
    private toastr: ToastrService,
    private peopleService: PeopleService
  ) {
  }

  ngOnInit() {
  }

  async search() {
    try {
      this.isLoading = true;
      const res = await this.peopleService.searchPeople(this.firstName, this.lastName).toPromise() as IPeopleList;
      if (res.totalCount) {
        this.close.emit({isNew: false, res});
      } else {
        this.close.emit({isNew: true, res: {firstName: this.firstName, lastName: this.lastName}});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
