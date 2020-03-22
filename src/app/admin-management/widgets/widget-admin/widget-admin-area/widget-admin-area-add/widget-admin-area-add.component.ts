import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { TypeCategory, TypesService } from '@one-core/service/types.service';
import { LayerService } from '@one-core/service/layer.service';
import { CommonService } from '@one-core/service/common.service';
import { LayerCategory } from '@one-core/model';
import { ToastrService } from '../../../../services/toastr.service';
import { MetaData } from '../../widget-admin-zone/widget-admin-zone-add/widget-admin-zone-add.component';

@Component({
  selector: 'one-admin-widget-admin-area-add',
  templateUrl: './widget-admin-area-add.component.html',
  styleUrls: ['./widget-admin-area-add.component.scss']
})
export class WidgetAdminAreaAddComponent implements OnInit, DoCheck {

  @Input() isAddWindow: boolean;
  @Input() isNew: boolean;
  @Input() center = {lat: 51.5074, lng: 0.1278};
  @Input() selectedArea: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  areaForm: FormGroup;
  area: any = {id: 0, name: '', metaData: {address: {country: 'uk'}}, parent: {metaData: {address: {country: 'uk'}}}};
  isLoading = false;
  isTypesLoading = false;
  isSitesLoading = false;
  types: any[] = [];
  sites: any[] = [];
  metadata: MetaData = {address: {city: '', longitude: 51.5074, latitude: 0.1278, country: '', county: '', line1: '', line2: '', postCode: ''}, description: ''};

  constructor(
    private toastr: ToastrService,
    private typesService: TypesService,
    private layerService: LayerService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    if (this.selectedArea) {
      if (this.selectedArea.id) {
        this.area = JSON.parse(JSON.stringify(this.selectedArea));
        /* this.layerService.getLayerDetail(this.area.parentId).subscribe((x: any) => {
           this.addressLookup.emit({lat: x.item.metaData.address.latitude, lng: x.item.metaData.address.longitude});
         });*/
      }
    }
    this.initAreaForm(this.area);
    this.getAreaTypes();
    if (!this.isAddWindow) {
      this.getSites();
    }

    this.areaForm.get('parentId').valueChanges
      .pipe(
        switchMap(x => this.layerService.getLayerDetail(x))
      ).subscribe((x: any) => {
      this.metadata.address = x.item.metaData.address;
      this.metadata.description = x.item.metaData.description;
      this.addressLookup.emit({lat: x.item.metaData.address.latitude, lng: x.item.metaData.address.longitude});
      const metadata = this.areaForm.get('metadata').value;
      this.areaForm.get('metadata').setValue({...metadata, address: x.item.metaData.address});
    });
  }

  ngDoCheck(): void {
    if (this.center) {
      this.metadata.address.latitude = this.center.lat;
      this.metadata.address.longitude = this.center.lng;
      this.areaForm.get('metadata').setValue(this.metadata);
    }
  }

  initAreaForm(area) {
    this.areaForm = this.formBuilder.group({
      name: [area.name || '', Validators.required],
      category: ['Area', Validators.required],
      parentId: [area.parentId || 0, Validators.required],
      description: [area.description || '', Validators.required],
      tenantKey: [this.commonService.tenantKey, Validators.required],
      typeId: [area.typeId || 0, Validators.required],
      metadata: [{description: area.metaData.description, address: area.parent.metaData.address} || {address: {country: 'uk'}}, Validators.required]
    });
  }

  async getAreaTypes() {
    try {
      this.isTypesLoading = true;
      const res: any = await this.typesService.getTypes(TypeCategory.Area).toPromise();
      this.types = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isTypesLoading = false;
    }
  }

  async getSites() {
    try {
      this.isSitesLoading = true;
      const res: any = await this.layerService.getLayers(LayerCategory.Site).toPromise();
      this.sites = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isSitesLoading = false;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      if (this.isNew) {
        await this.layerService.createLayer(this.areaForm.value).toPromise();
      } else {
        await this.editArea();
      }
      this.close.emit({success: true, isNew: true});
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  async editArea() {
    const meta = this.areaForm.value.metadata;
    meta.Description = this.areaForm.value.description;
    const body = [
      {value: this.areaForm.value.name, path: '/name', op: 'replace', from: 'intelico'},
      {value: this.areaForm.value.typeId, path: '/typeId', op: 'replace', from: 'intelico'},
      {value: this.areaForm.value.parentId, path: '/parentId', op: 'replace', from: 'intelico'},
      {value: meta, path: '/metadata', op: 'replace', from: 'intelico'},
    ];
    await this.layerService.patchLayer(this.area.id, body).toPromise();
  }
}
