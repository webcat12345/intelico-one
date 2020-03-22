import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IdentifierService, IIdentifier } from '@one-core/service/identifier.service';
import { AdminManagementService } from '../../../../services/admin-management.service';
import { IIdentifierType } from '../widget-admin-identifier.interface';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-identifier-content',
  templateUrl: './widget-admin-identifier-content.component.html',
  styleUrls: ['./widget-admin-identifier-content.component.scss']
})
export class WidgetAdminIdentifierContentComponent implements OnInit {

  @Input() selectedId: IIdentifier;
  @Input() selectedType: IIdentifierType;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  isLoading = false;
  identifier: IIdentifier = {id: 0, name: '', typeId: 0, typeName: '', value: '', identifierSourceId: 0};

  constructor(
    private adminManagementService: AdminManagementService,
    private toastr: ToastrService,
    private idService: IdentifierService
  ) {
  }

  ngOnInit() {
    if (this.selectedId) {
      if (this.selectedId.id) {
        this.getIdentifier(this.selectedId.id);
      }
    } else {
      this.identifier.typeName = this.selectedType.name;
      this.identifier.typeId = this.selectedType.id;
    }
  }

  onSubmit() {
  }

  async getIdentifier(id) {
    try {
      this.isLoading = true;
      this.identifier = await this.idService.getIdentifierById(id).toPromise() as IIdentifier;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  openSubWindow(windowType: string): void {
    this.adminManagementService.openAdminSubWindow(windowType, true);
  }

}
