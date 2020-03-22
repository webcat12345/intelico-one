import { Component, DoCheck, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// One - Services
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LayerCategory } from '@one-core/model';

import { LayerService } from '@one-core/service/layer.service';
import { CommonService } from '@one-core/service/common.service';
import { ToastrService } from '../../../../services/toastr.service';
import { TypeCategory, TypesService } from '@one-core/service/types.service';

export interface Address {
  city: string;
  country: string;
  county: string;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  postCode: string;
}

export interface MetaData {
  description: string;
  address: Address;
}

@Component({
  selector: 'one-admin-widget-admin-zone-add',
  templateUrl: './widget-admin-zone-add.component.html',
  styleUrls: ['./widget-admin-zone-add.component.scss']
})
export class WidgetAdminZoneAddComponent implements OnInit, DoCheck, OnDestroy {

  @Input() isAddWindow: boolean;
  @Input() isNew: boolean;
  @Input() center = {lat: 51.5074, lng: 0.1278};
  @Input() selectedZone: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  isTypesLoading = false;
  isAreasLoading = false;
  zone: any = {id: 0, name: '', metaData: {address: {country: 'uk'}}, parent: {metaData: {address: {country: 'uk'}}}};
  types: any[] = [];
  areas: any[] = [];
  metadata: MetaData = {address: {city: '', longitude: 51.5074, latitude: 0.1278, country: '', county: '', line1: '', line2: '', postCode: ''}, description: ''};
  zoneForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private typesService: TypesService,
    private commonService: CommonService,
    private layerService: LayerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    if (this.selectedZone) {
      if (this.selectedZone.id > 0) {
        this.zone = JSON.parse(JSON.stringify(this.selectedZone));
        /* this.layerService.getLayerDetail(this.zone.parentId).subscribe((x: any) => {
           this.addressLookup.emit({lat: x.item.parent.metaData.address.latitude, lng: x.item.parent.metaData.address.longitude});
         });*/
      }
    }
    this.initZoneForm(this.zone);
    this.getZoneTypes();
    if (!this.isAddWindow) {
      this.getAreas();
    }

    this.subscriptions.push(
      this.zoneForm.get('parentId').valueChanges
        .pipe(switchMap(x => this.layerService.getLayerDetail(x)))
        .subscribe((x: any) => {
          this.metadata.address = x.item.metaData.address;
          this.metadata.description = x.item.metaData.description;
          this.addressLookup.emit({lat: x.item.metaData.address.latitude, lng: x.item.metaData.address.longitude});
          const metadata = this.zoneForm.get('metadata').value;
          this.zoneForm.get('metadata').setValue({...metadata, address: x.item.metaData.address});
        }));
  }

  ngDoCheck(): void {
    if (this.center) {
      this.metadata.address.latitude = this.center.lat;
      this.metadata.address.longitude = this.center.lng;
      this.zoneForm.get('metadata').setValue(this.metadata);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  initZoneForm(zone): void {
    this.zoneForm = this.formBuilder.group({
      name: [zone.name || '', Validators.required],
      category: ['Zone', Validators.required],
      description: [zone.description || '', Validators.required],
      tenantKey: [this.commonService.tenantKey, Validators.required],
      parentId: [zone.parentId || null, Validators.required],
      typeId: [zone.typeId || null, Validators.required],
      //  latitude: [zone.latitude || 51.5074, Validators.required],
      //  longitude: [zone.longitude || 0.1278, Validators.required],
      metadata: [{description: zone.metaData.description, address: zone.parent.metaData.address} || {address: {country: 'uk'}}, Validators.required]
    });
  }

  async getZoneTypes(): Promise<void> {
    try {
      this.isTypesLoading = true;
      const res: any = await this.typesService.getTypes(TypeCategory.Zone).toPromise();
      this.types = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isTypesLoading = false;
    }
  }

  async getAreas(): Promise<void> {
    try {
      this.isAreasLoading = true;
      const res: any = await this.layerService.getLayers(LayerCategory.Area).toPromise();
      this.areas = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isAreasLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.isNew) {
        await this.layerService.createLayer(this.zoneForm.value).toPromise();
      } else {
        await this.editZone();
      }
      this.close.emit({success: true, isNew: true});
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async editZone(): Promise<void> {
    const meta = this.zoneForm.value.metadata;
    meta.Description = this.zoneForm.value.description;
    const body = [
      {value: this.zoneForm.value.name, path: '/name', op: 'replace', from: 'intelico'},
      {value: this.zoneForm.value.typeId, path: '/typeId', op: 'replace', from: 'intelico'},
      {value: this.zoneForm.value.parentId, path: '/parentId', op: 'replace', from: 'intelico'},
      {value: meta, path: '/metadata', op: 'replace', from: 'intelico'},
    ];
    await this.layerService.patchLayer(this.zone.id, body).toPromise();
  }

  changeLocation(e): void {
    this.zoneForm.get('latitude').setValue(e.lat);
    this.zoneForm.get('longitude').setValue(e.lng);
  }
}
