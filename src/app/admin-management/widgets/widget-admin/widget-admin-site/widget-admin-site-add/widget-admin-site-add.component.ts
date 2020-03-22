import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayerDetail } from '@one-core/model';
import { TypeCategory, TypesService } from '@one-core/service/types.service';
import { LayerService } from '@one-core/service/layer.service';
import { CommonService } from '@one-core/service/common.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-site-add',
  templateUrl: './widget-admin-site-add.component.html',
  styleUrls: ['./widget-admin-site-add.component.scss']
})
export class WidgetAdminSiteAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedSite: LayerDetail;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  siteForm: FormGroup;

  isLoading = false;
  isTypesLoading = false;
  animationDone = false;
  types: Array<any> = [];
  site: any = {id: 0, name: ''};

  constructor(
    private commonService: CommonService,
    private layerService: LayerService,
    private typesService: TypesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.startAnimation();
    if (this.selectedSite) {
      if (this.selectedSite.id) {
        this.site = JSON.parse(JSON.stringify(this.selectedSite));
      }
    }
    this.initSiteForm(this.site);
    this.getSiteTypes();
  }

  initSiteForm(site: LayerDetail) {
    this.siteForm = this.formBuilder.group({
      name: [site.name || '', Validators.required],
      category: ['Site', Validators.required],
      description: [site.description || ''],
      tenantKey: [this.commonService.tenantKey, Validators.required],
      typeId: [site.typeId || 0, Validators.required],
      metadata: [site.metaData || {address: {country: 'uk'}}, Validators.required]
    });
  }

  async getSiteTypes() {
    try {
      this.isTypesLoading = true;
      const res = await this.typesService.getTypes(TypeCategory.Site).toPromise() as any;
      this.types = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isTypesLoading = false;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      if (this.isNew) {
        await this.layerService.createLayer(this.siteForm.value).toPromise();
      } else {
        await this.editSite();
      }
      this.close.emit({success: true, isNew: true, data: null});
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async editSite() {
    const meta = this.siteForm.value.metadata;
    meta.Description = this.siteForm.value.description;
    const body = [
      {value: this.siteForm.value.name, path: '/name', op: 'replace', from: 'intelico'},
      {value: this.siteForm.value.typeId, path: '/typeId', op: 'replace', from: 'intelico'},
      {value: this.siteForm.value.metadata, path: '/metadata', op: 'replace', from: 'intelico'},
    ];
    await this.layerService.patchLayer(this.site.id, body).toPromise();
  }

  onAddressChanged(e): void {
    this.addressLookup.emit(e.data);
    this.siteForm.get('metadata').setValue({
      address: {
        country: 'United Kingdom',
        postCode: e.data.postcode,
        city: e.data.ward,
        county: e.data.county,
        line1: e.data.line_1 || e.data.district,
        line2: e.data.line_2,
        latitude: e.data.latitude,
        longitude: e.data.longitude
      }
    });
  }

  private startAnimation() {
    this.animationDone = false;
    setTimeout(() => {
      this.animationDone = true;
    }, 400);
  }
}
