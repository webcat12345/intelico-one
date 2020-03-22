import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// One - Services
import { ActionStateService } from '../../services/action-state.service';

@Component({
  selector: 'one-admin-action-location',
  templateUrl: './action-location.component.html',
  styleUrls: ['./action-location.component.scss']
})
export class ActionLocationComponent implements OnInit {

  @Output() add: EventEmitter<any> = new EventEmitter<any>();

  stepInfo: any = {};
  isLoading = false;

  constructor(
    public actionStateService: ActionStateService,
  ) {
  }

  ngOnInit(): void {
  }

  selectZone(e): void {
    if (e) {
      if (this.actionStateService.action.locations) {
        const index = this.actionStateService.action.locations.findIndex(x => +x.id === +e.id);
        if (index < 0) {
          this.actionStateService.action.locations.push({id: e.id, name: e.name});
        }
      } else {
        this.actionStateService.action.locations = [{id: e.id, name: e.name}];
      }
    }
  }

  removeLocation(index): void {
    this.actionStateService.action.locations.splice(index, 1);
  }

  onNext(): void {
    this.actionStateService.changeStep(this.stepInfo.next);
  }

}
