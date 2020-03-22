import { Component, OnInit, ViewChild } from '@angular/core';
// One - Services
import { ToastrService } from '../../../../services/toastr.service';
import { ActionStateService } from '../../services/action-state.service';
import { UiSwitchComponent } from '@one-common/ui-kit/ui-switch/ui-switch.component';
import { LayerSelectorComponent } from '@one-common/ui-kit/layer-selector/layer-selector.component';

@Component({
  selector: 'one-admin-action-location-form',
  templateUrl: './action-location-form.component.html',
  styleUrls: ['./action-location-form.component.scss']
})
export class ActionLocationFormComponent implements OnInit {

  @ViewChild(LayerSelectorComponent, {static: true}) zoneSelector: LayerSelectorComponent;
  @ViewChild(UiSwitchComponent, {static: true}) uiSwitch: UiSwitchComponent;
  specificLocation = false;
  selected = {id: -1, name: 'All'};
  stepInfo: any = {};
  isLoadingLayer = false;

  constructor(
    public stateService: ActionStateService,
    private toastr: ToastrService
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isLoadingLayer = true;
      await this.stateService.getLayers();
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoadingLayer = false;
    }
  }

  selectZone(e): void {
    this.selected = e;
    const value = this.stateService.getFullLayerFormat(e.id);
    if (+value.site.id === -1 && +value.area.id === -1 && +value.zone.id === -1) {
      this.uiSwitch.value = false;
    } else {
      this.uiSwitch.value = true;
    }
  }

  toggleLocationMode(e): void {
    this.specificLocation = e;
    if (this.zoneSelector) {
      this.zoneSelector.setAnyMode(!this.specificLocation);
    }
  }

  save(): void {
    if (this.stateService.getLayerType(this.selected.id) === -1) {
      //  this.stateService.changeStep(this.stepInfo.next);
      //   return;
    }
    if (this.stateService.action.locations) {
      const index = this.stateService.action.locations.findIndex(x => +x.id === +this.selected.id);
      if (index < 0) {
        this.stateService.action.locations.push({id: this.selected.id, name: this.selected.name, type: this.stateService.getLayerType(this.selected.id)});
      }
    } else {
      this.stateService.action.locations = [{id: this.selected.id, name: this.selected.name, type: this.stateService.getLayerType(this.selected.id)}];
    }
    this.stateService.changeStep(this.stepInfo.next);
  }

}
