import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Asset } from '@one-core/service/assets.service';

@Injectable()
export class WidgetAssetsStateService {

  public countSteps$: BehaviorSubject<number> = new BehaviorSubject(1);
  public asset$: BehaviorSubject<Asset> = new BehaviorSubject({} as Asset);

  constructor() {

  }

  public updateCountSteps(count: number) {
    this.countSteps$.next(count);
  }

  public updateAsset(asset: Asset) {
    this.asset$.next(asset);
  }

}
