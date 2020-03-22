import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { IType } from '@one-core/service/types.service';
import { CompanyService, ICompany } from '@one-core/service/company.service';
import { ToastrService } from '../../../../services/toastr.service';
import { AdminManagementService } from '../../../../services/admin-management.service';

@Component({
  selector: 'one-admin-widget-admin-company-add',
  templateUrl: './widget-admin-company-add.component.html',
  styleUrls: ['./widget-admin-company-add.component.scss']
})
export class WidgetAdminCompanyAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedCompany: ICompany;
  @Input() companyTypes: IType[];
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  company: ICompany = {id: 0, tenantKey: '', companyTypeId: 0, typeName: '', name: '', email: '', address: '', contactNumber: '', peoples: 0};

  constructor(
    private adminManagementService: AdminManagementService,
    private toastr: ToastrService,
    private companyService: CompanyService
  ) {
  }

  ngOnInit() {
    if (this.selectedCompany) {
      if (this.selectedCompany.id) {
        this.company = JSON.parse(JSON.stringify(this.selectedCompany));
      }
    }
  }

  onSelectCompanyType(): void {
    const res = this.companyTypes.find(x => x.id === +this.company.companyTypeId);
    this.company.typeName = res ? res.value : '';
  }

  openSubWindow(windowType: string): void {
    this.adminManagementService.openAdminSubWindow(windowType, true);
  }

  async onSubmit() {
    let res: ICompany = null;
    try {
      this.isLoading = true;
      if (this.isNew) {
        res = await this.companyService.createCompany(this.company).toPromise() as ICompany;
        if (res.id) {
          this.toastr.success('Group created');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        await this.companyService.editCompany(this.company).toPromise();
        this.toastr.success('Group updated');
        this.close.emit({success: true, isNew: false, data: this.company});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onAddressChanged(e): void {
    this.addressLookup.emit(e);
    this.company.address = e.address.country + ' ' + (e.address.postal_code || '') + (e.address.postal_town || e.address.city || '') + (e.address.route || '');
  }
}
