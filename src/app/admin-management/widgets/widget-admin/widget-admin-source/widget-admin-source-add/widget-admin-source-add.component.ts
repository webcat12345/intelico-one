import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
// One - Services
import { select, Store } from '@ngrx/store';
import { getIdentifierTypes } from '../../../../../state/reducers';

import { LayerService } from '@one-core/service/layer.service';
import { SourceService } from '@one-core/service/source.service';
import { ToastrService } from '../../../../services/toastr.service';
import { TypeCategory, TypeList, TypesService } from '@one-core/service/types.service';

import { ZonesLocation } from '../widget-admin-source-location-map/widget-admin-source-location-map.component';

@Component({
  selector: 'one-admin-widget-admin-source-add',
  templateUrl: './widget-admin-source-add.component.html',
  styleUrls: ['./widget-admin-source-add.component.scss']
})
export class WidgetAdminSourceAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedSource: any;
  @Output() close: EventEmitter<any> = new EventEmitter();

  center = 'London, United Kingdom';
  source: any = {id: 0, name: ''};
  identifierTypes$ = this.store.pipe(select(getIdentifierTypes));
//  sourceTypes$ = this.store.pipe(select(getSourceTypes));
  sourceTypes: TypeList;
  isLoading = false;
  sourceForm: FormGroup;
  zonesLocationCenter: ZonesLocation = {latitude: 0, longitude: 0};

  constructor(
    private library: FaIconLibrary,
    private toastr: ToastrService,
    private sourceService: SourceService,
    private layerService: LayerService,
    private formBuilder: FormBuilder,
    private typesService: TypesService,
    private store: Store<any>
  ) {
    this.library.addIcons(faClipboard);
  }

  get getZonesLocationCenter() {
    return this.zonesLocationCenter;
  }

  ngOnInit() {
    if (this.selectedSource) {
      if (this.selectedSource.id) {
        this.source = JSON.parse(JSON.stringify(this.selectedSource));
      }
    }
    this.buildSourceForm(this.source);
    this.typesService.getTypes(TypeCategory.Condition).subscribe(
      res => {
        if (res.data.length) {
          this.sourceTypes = res;
        }
      }
    );
  }

  buildSourceForm(source: any) {
    this.sourceForm = this.formBuilder.group({
      name: [source.name || '', Validators.required],
      description: [source.description || '', Validators.required],
      zoneId: [source.zoneId || '', Validators.required],
      typeId: [source.typeId || '', Validators.required],
      latitude: [source.latitude || 51.5074, Validators.required],
      longitude: [source.longitude || 0.1278, Validators.required],
      identifierTypeId: [source.identifierTypeId || null, Validators.required]
    });
  }

  setZonesLocationCenter(e) {
    this.zonesLocationCenter = e;
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        await this.sourceService.createSource(this.sourceForm.value).toPromise();
      } else {
        await this.sourceService.editSource(this.source.id, this.sourceForm.value).toPromise();
      }
      this.close.emit({success: true, isNew: false});
    } finally {
      this.isLoading = false;
    }
  }

  copySourceKey(e) {
    e.select();
    document.execCommand('copy');
    this.toastr.success('Source Key copied to the clipboard.');
  }

  changeLocation(e) {
    this.sourceForm.get('latitude').setValue(e.lat);
    this.sourceForm.get('longitude').setValue(e.lng);
  }

}
