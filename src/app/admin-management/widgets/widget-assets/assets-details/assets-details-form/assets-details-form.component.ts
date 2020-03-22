import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { FormBuilder, FormGroup } from '@angular/forms';
import { Asset } from '@one-core/service/assets.service';
import { SourceService } from '@one-core/service/source.service';
import { CompanyService } from '@one-core/service/company.service';
import { IType, TypesService } from '@one-core/service/types.service';
import { WidgetAssetsStateService } from '../../services/widget-assets-state.service';

@Component({
  selector: 'one-admin-assets-details-form',
  templateUrl: './assets-details-form.component.html',
  styleUrls: ['./assets-details-form.component.scss']
})
export class AssetsDetailsFormComponent implements OnInit {

  @Input() asset: Asset;
  @Input() typesAssets: Array<IType> = [];
  @Input() isNew: boolean;
  @Output() nextStep: EventEmitter<string> = new EventEmitter();

  selectGroupName: FormGroup = this.fb.group({
    group_name: ['']
  });
  selectTypeName: FormGroup = this.fb.group({
    type_name: ['']
  });

  groupNames: Array<any> = [];

  constructor(private widgetAssetsStateService: WidgetAssetsStateService,
              private fb: FormBuilder,
              private typesService: TypesService,
              private sourceService: SourceService,
              private companyService: CompanyService) {
  }

  async ngOnInit(): Promise<void> {
    this.selectGroupName.controls.group_name.setValue('default');
    this.selectTypeName.controls.type_name.setValue('default');

    if (!this.isNew || this.asset.typeId) {
      this.typesAssets.map((item) => {
        if (item.id === this.asset.typeId) {
          this.selectTypeName.controls.type_name.setValue(item.value);
        }
      });
    }
    this.companyService.getCompanies('').toPromise()
      .then(
        companies => {
          if (companies.data.length > 0) {
            companies.data.map((item, index) => {
              this.groupNames.push({id: item.id, value: item.name});
            });
          }
          if (!this.isNew || this.asset.groupId) {
            this.groupNames.map((item) => {
              if (item.id === this.asset.groupId) {
                this.selectGroupName.controls.group_name.setValue(item.value);
              }
            });
          }
        }
      );

    this.selectGroupName.get('group_name').valueChanges.subscribe(groupName => {
      if (groupName) {
        this.groupNames.map((item) => {
          if (item.value === groupName) {
            this.asset.groupId = item.id;
          }
        });
      }
    });
    this.selectTypeName.get('type_name').valueChanges.subscribe(typeAsset => {
      if (typeAsset) {
        this.typesAssets.map((item) => {
          if (typeAsset === item.value) {
            this.asset.typeId = item.id;
          }
        });
      }
    });
  }

  nextStepAssets(): void {
    this.nextStep.emit('location');
    this.widgetAssetsStateService.updateAsset(this.asset);
    this.widgetAssetsStateService.updateCountSteps(2);
  }

  fileChange(event): void {
    this.asset.imageFile = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.asset.imageUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeImage(): void {
    this.asset.imageUrl = null;
  }

}
