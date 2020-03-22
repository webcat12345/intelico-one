import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from '../../../services/toastr.service';
import { Asset, AssetsService } from '@one-core/service/assets.service';
import { WidgetAssetsStateService } from '../services/widget-assets-state.service';

@Component({
  selector: 'one-admin-assets-location',
  templateUrl: './assets-location.component.html',
  styleUrls: ['./assets-location.component.scss']
})
export class AssetsLocationComponent implements OnInit, OnDestroy {

  @Input() isNew: boolean;
  @Output() complete: EventEmitter<boolean> = new EventEmitter();

  asset: Asset;
  isLoading = false;
  subscriptionAsset: Subscription;

  constructor(
    private widgetAssetsStateService: WidgetAssetsStateService,
    private toastr: ToastrService,
    private assetsService: AssetsService
  ) {
  }

  ngOnInit(): void {
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

  async completeAsset(): Promise<void> {
    try {
      this.isLoading = true;
      delete this.asset.imageUrl;
      if (this.isNew) {
        this.assetsService.createAsset(this.asset)
          .subscribe(
            resp => {
              if (this.asset.imageFile) {
                this.assetsService.uploadImageAsset(resp.id, this.asset.imageFile)
                  .subscribe(
                    response => {
                    }, err => console.error(err)
                  );
              }
              this.complete.emit(true);
            }, err => console.error(err)
          );
      }
      if (!this.isNew) {
        if (this.asset.imageFile) {
          this.assetsService.editAsset(this.asset.id, this.asset)
            .subscribe(
              response => {
                if (response) {
                  if (this.asset.imageId) {
                    this.assetsService.deleteImageAsset(this.asset.imageId)
                      .subscribe(
                        success => {
                          this.assetsService.uploadImageAsset(this.asset.id, this.asset.imageFile)
                            .subscribe(
                              resp => {
                                this.complete.emit(true);
                              }, err => console.error(err)
                            );
                        }, err => console.error(err)
                      );
                  } else {
                    this.assetsService.uploadImageAsset(this.asset.id, this.asset.imageFile)
                      .subscribe(
                        resp => {
                          this.complete.emit(true);
                        }, err => console.error(err)
                      );
                  }
                }
              }, err => console.error(err)
            );
        }
        if (!this.asset.imageFile) {
          this.assetsService.editAsset(this.asset.id, this.asset)
            .subscribe(
              response => {
                this.complete.emit(true);
              }, err => console.error(err)
            );
        }
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = true;
    }
  }
}
