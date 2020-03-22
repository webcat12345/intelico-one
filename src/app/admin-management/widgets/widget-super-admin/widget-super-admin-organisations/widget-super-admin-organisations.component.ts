import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IOrganisation, IOrganisationList, OrganisationService } from '@one-core/service/organisation.service';
import { CommonService } from '@one-core/service/common.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { flyIn } from '@one-animation/flyIn.animation';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-organisations',
  templateUrl: './widget-super-admin-organisations.component.html',
  styleUrls: ['./widget-super-admin-organisations.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminOrganisationsComponent implements OnInit {

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '', isLink: false},
    {label: 'Admin', name: 'adminUser', width: '30%', isLink: false},
    {label: 'Users', name: 'users', width: '15%', isLink: true},
    {label: 'Sites', name: 'sites', width: '15%', isLink: true},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  isAddModal = false;
  isLoading = false;
  showAddModal = false;
  showConfirmModal = false;
  showSwitchModal = false;

  searchKey = '';
  selectedOrganisation: IOrganisation = null;
  organisationList: IOrganisationList = {data: [], totalCount: 0};
  currentPage = 1;
  itemsPerPage = 100;

  constructor(
    private organisationService: OrganisationService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getOrganisations();
  }

  async getOrganisations() {
    try {
      this.isLoading = true;
      this.organisationList = await this.organisationService.getOrganisations(this.currentPage).toPromise() as IOrganisationList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateOrganisation(): void {
    this.isAddModal = true;
    this.selectedOrganisation = null;
    this.showAddModal = true;
  }

  onEditOrganisation(e): void {
    this.isAddModal = false;
    this.selectedOrganisation = e;
    this.showAddModal = true;
  }

  onDeleteConfirm(e) {
    this.showConfirmModal = true;
    this.selectedOrganisation = e;
  }

  async onRemoveOrganisation(flag) {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedOrganisation = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.organisationService.removeOrganisation(this.selectedOrganisation.id).toPromise();
      await this.getOrganisations();
      this.toastr.success('Organisation has been removed');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.showConfirmModal = false;
      this.selectedOrganisation = null;
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getOrganisations();
    }
    this.showAddModal = false;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.ngOnInit();
  }

  logout() {
    this.router.navigate(['/organization-select']);
  }

}
