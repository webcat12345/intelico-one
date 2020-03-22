import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IPeople } from '@one-core/service/people.service';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';
import { CompanyService, ICompany, ICompanyList } from '@one-core/service/company.service';

@Component({
  selector: 'one-admin-widget-admin-people-tab-company',
  templateUrl: './widget-admin-people-tab-company.component.html',
  styleUrls: ['./widget-admin-people-tab-company.component.scss']
})
export class WidgetAdminPeopleTabCompanyComponent implements OnInit {

  @Input() people: IPeople;
  @Output() change: EventEmitter<any> = new EventEmitter();

  isTypesLoading = true;
  companyTypes$: Observable<IType[]>;
  companyTypeId = 0;

  isCompaniesLoading = false;
  companies: ICompany[] = [];

  isJoinedListLoading = false;
  joinList: ICompany[] = [];
  selectedId = 0;

  query = '';

  constructor(
    private typeService: TypesService,
    private companyService: CompanyService
  ) {
  }

  ngOnInit() {
    this.companyTypes$ = this.typeService.getTypes(TypeCategory.Company)
      .pipe(
        map((x: any) => x.data),
        tap(x => this.isTypesLoading = false)
      );
    this.getCompany();
    if (this.people.id && this.people.companies > 0) { // This means people is already created and have some comapnies
      this.getJoinedCompanies();
    }
  }

  selectCompany(el) {
    const item = this.companies.find(x => x.id === +this.selectedId);
    if (!item) {
      return;
    } else {
      item.selected = true;
    }
    if (!this.joinList.find(x => x.id === +this.selectedId)) {
      this.joinList.push(JSON.parse(JSON.stringify(item)));
    }
    this.selectedId = 0;
    el.control.markAsPristine();
    this.change.emit(this.joinList);
  }

  removeItem(e, index) {
    this.joinList.splice(index, 1);
    const item = this.companies.find(x => x.id === e.id);
    if (item) {
      item.selected = false;
    }
    this.change.emit(this.joinList);
  }

  async getJoinedCompanies() {
    try {
      this.isJoinedListLoading = true;
      // TODO: Need to get linked companyList
    } catch (e) {

    } finally {
      this.isJoinedListLoading = false;
    }
  }

  typeChanged() {
    this.query = this.companyTypeId > 0 ? ` and companyTypeId eq ${this.companyTypeId}` : '';
    this.getCompany();
  }

  private async getCompany() {
    this.isCompaniesLoading = true;
    try {
      this.companies = await this.companyService.getCompanies(this.query)
        .pipe(
          map((x: ICompanyList) => {
            x.data.map(item => {
              const re = this.joinList.find(j => +j.id === +item.id);
              if (re) {
                item.selected = true;
              }
            });
            return x.data;
          })
        )
        .toPromise();
    } catch (e) {

    } finally {
      this.isCompaniesLoading = false;
    }
  }

}
