import { Component, OnDestroy, OnInit } from '@angular/core';
// One - Services
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { WidgetAssetsStateService } from '../services/widget-assets-state.service';

@Component({
  selector: 'one-admin-assets-badge',
  templateUrl: './assets-badge.component.html',
  styleUrls: ['./assets-badge.component.scss']
})
export class AssetsBadgeComponent implements OnInit, OnDestroy {

  countSteps: number;
  subscriptionNextStep: Subscription;

  constructor(private widgetAssetsStateService: WidgetAssetsStateService) {
  }

  ngOnInit() {
    this.subscriptionNextStep = this.widgetAssetsStateService.countSteps$.pipe(first()).subscribe(
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
    this.widgetAssetsStateService.updateCountSteps(this.countSteps - 1);
  }
}
