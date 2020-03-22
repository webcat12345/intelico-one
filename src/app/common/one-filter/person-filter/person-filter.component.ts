import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IPeopleList, PeopleService } from '@one-core/service/people.service';

@Component({
  selector: 'one-admin-person-filter',
  templateUrl: './person-filter.component.html',
  styleUrls: ['./person-filter.component.scss']
})
export class PersonFilterComponent implements OnInit, OnDestroy {
  @Output() changeFilterPeopleId: EventEmitter<string> = new EventEmitter();

  persons: IPeopleList = {data: [], totalCount: 0};

  filter: FormGroup = this.fb.group({
    personId: [null]
  });
  private unsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService
  ) { }

  ngOnInit(): void {
    this.filter.get('personId').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      if (res) {
        this.changeFilterPeopleId.emit(res);
      } else {
        this.changeFilterPeopleId.emit(null);
      }
    });
    this.peopleService.getPeople('')
      .subscribe(resp => {
        if (resp.data) {
          resp.data.map(item => {
            item.lastNameFirstName = item.lastName + ' ' + item.firstName;
          });
          this.persons = resp;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
