import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../interceptors/api.service';
import { Observable } from 'rxjs';

export interface ICompany {
  id: number;
  groupId?: number;
  tenantKey: string;
  companyTypeId: number;
  typeName: string;
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  description?: string;
  peoples: number;
  selected?: boolean;
  group?: any;
}

export interface ICompanyList {
  data: ICompany[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends ApiService {

  getCompanies(query?, pageNumber: number = 1): Observable<ICompanyList> {
    return this.http.get<ICompanyList>(ApiService.baseApiUrl('groups'), {
      params: new HttpParams()
        .set('filterBy', `tenantKey eq '${this.tenantKey}'${query}`)
    });
  }

  getCompaniesByIdentifier(filterBy): Observable<ICompanyList> {
    return this.http.get<ICompanyList>(ApiService.baseApiUrl('groups/identifiers'), {
      params: new HttpParams()
        .set('filterBy', `identifier eq '${filterBy}'`)
    });
  }

  createCompany(company: ICompany) {
    delete company.id;
    const body = {
      TenantKey: this.tenantKey,
      Name: company.name,
      Email: 'company.email',
      Address: company.address,
      ContactNumber: company.contactNumber,
    };
    return this.http.post(ApiService.baseApiUrl('groups'), body, {headers: this.httpHeaders});
  }

  editCompany(company: ICompany) {
    const body = [
      {op: 'replace', path: '/name', value: company.name},
      {op: 'replace', path: '/address', value: company.address},
      {op: 'replace', path: '/email', value: 'company.email'},
      {op: 'replace', path: '/tenantKey', value: this.tenantKey}
    ];
    return this.http.patch(ApiService.baseApiUrl(`groups/${company.id}`), body, {headers: this.httpHeaders});
  }

  removeCompany(id: number) {
    return this.http.delete(ApiService.baseApiUrl(`groups/${id}`));
  }

}
