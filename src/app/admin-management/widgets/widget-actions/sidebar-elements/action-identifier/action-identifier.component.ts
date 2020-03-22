import { Component, OnInit } from '@angular/core';

import { ActionStateService } from '../../services/action-state.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-action-identifier',
  templateUrl: './action-identifier.component.html',
  styleUrls: ['./action-identifier.component.scss']
})
export class ActionIdentifierComponent implements OnInit {

  newIdentifier = '';
  searchKey = '';
  stepInfo: any = {};
  identifiers = [];
  filteredIdentifiers = [];
  isLoading = false;

  constructor(
    public actionStateService: ActionStateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getActionById();
  }

  async getActionById() {
    try {
      this.isLoading = true;
      await this.actionStateService.getActionById();
      this.identifiers = this.actionStateService.action.identifiers.map(x => x.value);
      this.filteredIdentifiers = this.identifiers;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  removeFromList(index, value) {
    this.identifiers.splice(index, 1);
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      const identifier = this.newIdentifier.toString().toUpperCase().replace(/\s/g, '');
      // check if identifier is already exists
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
      await this.actionStateService.updateIdentifiers(value, newArray).toPromise();
      this.toastr.success('Successfully updated identifiers.');
      this.actionStateService.closeSidebar();
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  changeSearch() {
    if (this.searchKey) {
      this.filteredIdentifiers = this.identifiers.filter(x => {
        return x.toString().toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1;
      });
    } else {
      return this.filteredIdentifiers = this.identifiers;
    }

  }

}
