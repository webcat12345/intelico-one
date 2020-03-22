import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Asset } from '@one-core/service/assets.service';
import { WidgetAssetsStateService } from '../services/widget-assets-state.service';
import { IType } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-assets-details',
  templateUrl: './assets-details.component.html',
  styleUrls: ['./assets-details.component.scss']
})
export class AssetsDetailsComponent implements OnInit, OnDestroy {

  @Input() isNew: boolean;
  @Input() typesAssets: Array<IType> = [];
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  asset: Asset;
  isLoading = false;
  subscriptionAsset: Subscription;

  constructor(private widgetAssetsStateService: WidgetAssetsStateService) {
  }

  ngOnInit() {
    this.subscriptionAsset = this.widgetAssetsStateService.asset$.pipe(first()).subscribe(
      asset => {
        if (asset) {
          this.asset = asset;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionAsset.unsubscribe();
  }

  nextStepPerson(e) {
    this.nextStep.emit(e);
  }

}
