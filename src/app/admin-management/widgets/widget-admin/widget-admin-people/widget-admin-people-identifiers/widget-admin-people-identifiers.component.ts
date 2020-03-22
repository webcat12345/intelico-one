import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { IPeople } from '@one-core/service/people.service';
import { WidgetAdminPeopleStateService } from '../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-identifiers',
  templateUrl: './widget-admin-people-identifiers.component.html',
  styleUrls: ['./widget-admin-people-identifiers.component.scss']
})
export class WidgetAdminPeopleIdentifiersComponent implements OnInit, OnDestroy {

  @Input() isNew: boolean;
  @Input() person: IPeople;
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() closeAddModal: EventEmitter<boolean> = new EventEmitter();
  isLoading = false;
  subscriptionPerson: Subscription;

  constructor(
    public widgetAdminPeopleStateService: WidgetAdminPeopleStateService
  ) {
  }

  ngOnInit(): void {
    this.subscriptionPerson = this.widgetAdminPeopleStateService.person$.subscribe(
      person => {
        if (person) {
          this.person = person;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionPerson.unsubscribe();
  }

  nextStepPerson(e): void {
    this.nextStep.emit(e);
  }
}
