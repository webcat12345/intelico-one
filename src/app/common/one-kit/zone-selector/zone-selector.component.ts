import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map } from 'rxjs/operators';
import { LayerService } from '@one-core/service/layer.service';
import { Layer, LayerCategory } from '@one-core/model';
import { ToastrService } from '../../../admin-management/services/toastr.service';

@Component({
  selector: 'one-admin-zone-selector',
  templateUrl: './zone-selector.component.html',
  styleUrls: ['./zone-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZoneSelectorComponent),
      multi: true
    },
  ]
})
export class ZoneSelectorComponent implements ControlValueAccessor, OnInit {

  @Output() zonesLocation: EventEmitter<{ latitude: number, longitude: number }> = new EventEmitter<{ latitude: number, longitude: number }>();
  sites: Layer[] = [];
  areas: Layer[] = [];
  zones: Layer[] = [];

  selectedSite = undefined;
  selectedArea = undefined;
  selectedZone: number;

  isLoading = false;

  constructor(
    private layerService: LayerService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.loadSites();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(zoneId: number): void {
    if (zoneId) {
      this.selectedZone = zoneId;
    }
  }

  onSiteChange() {
    this.selectedArea = undefined;
    this.selectedZone = undefined;
    this.propagateChange(this.selectedZone);
  }

  onAreaChange() {
    this.selectedZone = undefined;
    this.propagateChange(this.selectedZone);
  }

  onZoneChange(e) {
    this.selectedZone = e;
    this.propagateChange(this.selectedZone);
    this.zones.map((item) => {
      if (item.id === +this.selectedZone) {
        this.zonesLocation.emit({latitude: item.metaData.address.latitude, longitude: item.metaData.address.longitude});
      }
    });
  }

  private propagateChange = (_: any) => {

  }

  private async loadSites() {
    try {
      this.isLoading = true;
      this.sites = await this.layerService.getLayers(LayerCategory.Site).pipe(map((res: any) => res.data)).toPromise();
      this.areas = await this.layerService.getLayers(LayerCategory.Area).pipe(map((res: any) => res.data)).toPromise();
      this.zones = await this.layerService.getLayers(LayerCategory.Zone).pipe(map((res: any) => res.data)).toPromise();
      if (this.selectedZone) {
        this.representFromZone();
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  private representFromZone() {
    const zone = this.zones.find(x => x.id === this.selectedZone);
    if (zone) {
      this.selectedArea = zone.parentId;
      const area = this.areas.find(x => x.id === this.selectedArea);
      if (area) {
        this.selectedSite = area.parentId;
      }
    }
  }

}
