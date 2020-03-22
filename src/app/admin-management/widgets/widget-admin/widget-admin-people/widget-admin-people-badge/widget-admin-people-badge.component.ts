import { Component, OnDestroy, OnInit } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { WidgetAdminPeopleStateService } from '../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-badge',
  templateUrl: './widget-admin-people-badge.component.html',
  styleUrls: ['./widget-admin-people-badge.component.scss']
})
export class WidgetAdminPeopleBadgeComponent implements OnInit, OnDestroy {

  countSteps: number;
  subscriptionNextStep: Subscription;

  constructor(private widgetAdminPeopleStateService: WidgetAdminPeopleStateService) {
  }

  ngOnInit() {
    this.subscriptionNextStep = this.widgetAdminPeopleStateService.countSteps$.pipe(first()).subscribe(
      countStep => {
        if (countStep) {
          this.countSteps = countStep;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionNextStep.unsubscribe();
  }

  backStep() {
    this.widgetAdminPeopleStateService.updateCountSteps(this.countSteps - 1);
  }

}
