import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '@one-core/service/common.service';
import { IOrganisation, IOrganisationList, OrganisationService } from '@one-core/service/organisation.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../../core/models/authentication';

@Component({
  selector: 'one-admin-org-select',
  templateUrl: './org-select.component.html',
  styleUrls: ['./org-select.component.scss']
})
export class OrgSelectComponent implements OnInit {

  isLoading = false;
  orgs: IOrganisation[] = [];
  selectedOrg: IOrganisation = {id: '', name: '', tenantKey: '', users: 0, sites: 0, selectedDefault: false};

  constructor(
    private router: Router,
    private commonService: CommonService,
    private orgService: OrganisationService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.initialize();
  }

  getOrganisation() {
    this.selectedOrg = this.commonService.organisation;
    // when default org is selected and checked with different account, it shouldn't be there in the org list
    let index = -1;
    if (this.selectedOrg) {
      index = this.orgs.findIndex(x => x.id === this.selectedOrg.id);
    }
    if (index < 0) {
      this.selectedOrg = null;
    }
    if (!this.selectedOrg) {
      this.selectedOrg = {id: '', name: '', tenantKey: '', users: 0, sites: 0, selectedDefault: false};
    } else if (this.selectedOrg.selectedDefault === false) {
      this.selectedOrg.id = '';
    }
  }

  initialize() {
    this.isLoading = true;
    const role = this.commonService.userRole;
    if (role === UserRole.SuperAdmin) {
      this.orgService.getAllOrganisations().subscribe((res: IOrganisationList) => {
        this.isLoading = false;
        this.orgs = res.data;
        this.getOrganisation();
      });
    } else {
      this.authService.getUserInfo().subscribe((res: any) => {
        this.isLoading = false;
        this.orgs = res.data;
        this.getOrganisation();
      }, (err) => this.isLoading = false);
    }
  }

  submit() {
    const index = this.orgs.findIndex(x => x.id === this.selectedOrg.id);
    if (index > -1) {
      if (this.selectedOrg.selectedDefault) {
        this.orgs[index].selectedDefault = true;
      } else {
        this.orgs[index].selectedDefault = false;
      }
      this.selectedOrg = this.orgs[index];
      this.commonService.storeOrganisation(this.selectedOrg);
      this.router.navigate(['/loading']);
    }
  }

}
