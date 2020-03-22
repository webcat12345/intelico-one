import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { ICompany } from '@one-core/service/company.service';
import { ToastrService } from '../../../../services/toastr.service';
import { IPeople, PeopleService } from '@one-core/service/people.service';
import { WidgetAdminPeopleStateService } from '../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-add',
  templateUrl: './widget-admin-people-add.component.html',
  styleUrls: ['./widget-admin-people-add.component.scss']
})
export class WidgetAdminPeopleAddComponent implements OnInit, OnDestroy {

  @Input() isNew: boolean;
  @Input() selectedPeople: IPeople;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  people: IPeople;

  companyList: ICompany[] = [];
  isLoading = false;
  subscriptionPerson: Subscription;

  constructor(
    private toastr: ToastrService,
    private peopleService: PeopleService,
    private widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
  ) {
  }

  ngOnInit() {
    if (this.selectedPeople) {
      if (this.selectedPeople.id) {
        // IMPORTANT: If id is 'newUser' then first name and last name should be prepopulated.
        this.people = JSON.parse(JSON.stringify(this.selectedPeople));
      }
    }
    this.subscriptionPerson = this.widgetAdminPeopleStateService.person$.subscribe(
      person => {
        if (person) {
          this.people = person;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionPerson.unsubscribe();
  }

  nextStepPerson(e) {
    this.nextStep.emit(e);
  }
}
