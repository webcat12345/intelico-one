import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { IPeople } from '@one-core/service/people.service';
import { WidgetAdminPeopleStateService } from '../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-products',
  templateUrl: './widget-admin-people-products.component.html',
  styleUrls: ['./widget-admin-people-products.component.scss']
})
export class WidgetAdminPeopleProductsComponent implements OnInit, OnDestroy {

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
}
