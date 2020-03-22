import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IdentifierService, IIdentifierList } from '@one-core/service/identifier.service';
import { IIdentifierType } from '../widget-admin-identifier.interface';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-identifier-search',
  templateUrl: './widget-admin-identifier-search.component.html',
  styleUrls: ['./widget-admin-identifier-search.component.scss']
})
export class WidgetAdminIdentifierSearchComponent implements OnInit {

  @Input() selectedType: IIdentifierType;
  @Output() searchFinished: EventEmitter<any> = new EventEmitter();

  searchName: string;
  searchResult: IIdentifierList = {data: [], totalCount: 0};
  isSearching = false;

  constructor(
    private idService: IdentifierService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
  }

  async doSearch() {
    this.isSearching = true;
    try {
      this.searchResult = await this.idService.searchIdentifier(this.searchName).toPromise() as IIdentifierList;
      if (this.searchResult.totalCount > 0) {
        this.searchFinished.emit(this.searchResult.data[0]);
      } else {
        this.searchFinished.emit(null);
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isSearching = false;
    }
  }

}
