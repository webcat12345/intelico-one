import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// One - Services
import { ToastrService } from '../../../../services/toastr.service';
import { ActionStateService } from '../../services/action-state.service';

@Component({
  selector: 'one-admin-action-trigger',
  templateUrl: './action-trigger.component.html',
  styleUrls: ['./action-trigger.component.scss']
})
export class ActionTriggerComponent implements OnInit {

  @Output() add: EventEmitter<any> = new EventEmitter<any>();

  newIdentifier = '';
  searchKey = '';
  stepInfo: any = {};
  identifiers = [];
  filteredIdentifiers = [];
  isLoading = false;
  values: any = {};

  constructor(
    public actionStateService: ActionStateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.identifiers = this.actionStateService.action.identifiers.map(x => x.value);
    this.filteredIdentifiers = this.identifiers;
  }

  removeFromList(index, value) {
    this.identifiers.splice(index, 1);
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      //  const identifier = this.newIdentifier.toString().toUpperCase().replace(/\s/g, '');
      const identifier = this.newIdentifier.toString().toUpperCase();
      // check if identifier is exists
      const index = this.identifiers.findIndex(x => x === identifier);
      if (index >= 0) {
        this.toastr.warning('This identifier already exists');
      }
      if (index < 0 && identifier) {
        this.identifiers.push(identifier);
      }
      this.newIdentifier = '';
    }
  }

  async onNext() {
    try {
      this.isLoading = true;
      const value = this.identifiers.map(x => {
        return {value: x};
      });
      const newArray = this.actionStateService.action.identifiers.map(x => {
        return {value: x.value};
      });
      if (this.filteredIdentifiers.length > 0) {
        this.actionStateService.changeIdentifiersOrMetadata({id: true, metaData: false});
        this.actionStateService.changeStep(4);
      }
      if (this.filteredIdentifiers.length === 0) {
        this.actionStateService.changeIdentifiersOrMetadata({id: false, metaData: true});
        this.actionStateService.changeStep(3);
      }
      if (this.actionStateService.isEditModal) {
        await this.actionStateService.updateIdentifiers(value, newArray).toPromise();
        this.toastr.success('Identifier is updated.');
      }
      this.actionStateService.saveIdentifiers(value);
      // this.actionStateService.changeStep(this.stepInfo.next);
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  changeSearch(e) {
    this.searchKey = e;
    if (this.searchKey) {
      this.filteredIdentifiers = this.identifiers.filter(x => {
        return x.toString().toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1;
      });
    } else {
      return this.filteredIdentifiers = this.identifiers;
    }
  }
}
