import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiService } from '../interceptors/api.service';

export interface Identifier {
  value: string;
  typeId: string;
  typeName?: string;
}

export interface Identifiers {
  newIdentifiers: Array<Identifier>;
  removeIdentifiers: Array<number>;
}

export interface CreateRemoveGroups {
  newGroups: Array<string>;
  removeGroups: Array<string>;
}

export interface CreateRemoveProducts {
  newProducts: Array<string>;
  removeProducts: Array<string>;
}

export interface Groups {
  id: number;
  groupName: string;
}

export interface GenderType {
  id: number;
  name: string;
}

export interface PeopleIdentifiers {
  id: number;
  identifier: string;
  identifierTypeId: number;
  peopleId: string;
}

export interface Group {
  address: string;
  contactNumber: string;
  email: string;
  groupIdentifiers: any;
  id: string;
  name: string;
  peopleGroupAssociates: Array<any>;
  tenantKey: string;
}

export interface PeopleGroupAssociates {
  createdDate: string;
  group: Group;
  groupId: string;
  id: number;
  modifiedDate: string;
  peopleId: string;
}

export interface Product {
  id: string;
  name: string;
  peopleProductAssociates: Array<any>;
  tenantKey: string;
}

export interface PeopleProductAssociates {
  createdDate: string;
  product: Product;
  productId: string;
  id: number;
  modifiedDate: string;
  peopleId: string;
}

export interface MetaData {
  address?: AddressPeople;
  age?: number;
  birthday: Date;
  build?: string;
  ethnicity?: string;
  eyeColor?: string;
  gender: GenderType;
  hairColor?: string;
  height?: string;
  mobileNumber?: number;
  postCode: string;
  securityPin?: string;
}

export interface AddressPeople {
  city?: string;
  town?: string;
  country: string;
  county: string;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  postCode: string;
  addressPeople?: string;
}

export interface IPeopleAddress {
  city: string;
  country: string;
  county: string;
  latitude: number;
  line1: string;
  line2: string;
  longitude: number;
  postCode: string;
  town: string;
}

export interface IPeople {
  id: string;
  firstName: string;
  lastName: string;
  tenantKey: string;
  email: string;
  addressUI?: string;
  address?: IPeopleAddress;
  // identifiers: Identifiers;
  identifiers: any;
  groups: CreateRemoveGroups;
  products: CreateRemoveProducts;
  metadata: MetaData;
  companies: number;
  peopleTypeId: number;
  peopleSourceId: number;
  typeName?: string;
  createdDate?: string;
  modifiedDate?: string;
  peopleIdentifiers?: Array<PeopleIdentifiers>;
  peopleGroupAssociates?: Array<PeopleGroupAssociates>;
  peopleProductAssociates?: Array<PeopleProductAssociates>;
  TypeId: string;
}

export interface CreateEditPeople {
  id: string;
}

export interface IPeopleList {
  data: IPeople[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService extends ApiService {

  dataIdentifiers: Identifiers = {removeIdentifiers: [], newIdentifiers: []};
  editGroups: CreateRemoveGroups;
  editProducts: CreateRemoveProducts;

  setDataIdentifiers(dataIdentifiers: Identifier[], removeIdentifiers: Array<number>): void {
    this.dataIdentifiers.newIdentifiers = dataIdentifiers;
    this.dataIdentifiers.removeIdentifiers = removeIdentifiers;
  }

  setEditGroups(editGroupsData: CreateRemoveGroups): void {
    this.editGroups = editGroupsData;
  }

  setEditProducts(editProductsData: CreateRemoveProducts): void {
    this.editProducts = editProductsData;
  }

  getPeople(filter: string): Observable<any> {
    return this.http.get(ApiService.baseApiUrl(`people`), {
      headers: this.httpHeaders,
      params: new HttpParams()
        .set('filterBy', `tenantKey eq '${this.tenantKey}'${filter}`)
        .set('orderBy', `createdDate`)
        .set('recordCount', `20`)
    });
  }

  getPerson(id): Observable<any> {
    return this.http.get(ApiService.baseApiUrl(`people/${id}`), {
      headers: this.httpHeaders,
    });
  }

  searchPeople(firstName, lastName): Observable<any> {
    firstName = firstName.toLowerCase();
    lastName = lastName.toLowerCase();
    const query = `tenantKey eq '${this.tenantKey}' and firstName eq '${firstName}' and lastName eq '${lastName}'`;
    return this.http.get(ApiService.baseApiUrl(`people`), {
      headers: this.httpHeaders,
      params: new HttpParams()
        .set('filterBy', query)
    });
  }

  createPeople(people): Observable<CreateEditPeople> {
    // delete people.id;
    people.tenantKey = this.tenantKey;
    const body = {
      FirstName: people.firstName,
      LastName: people.lastName,
      Email: people.email,
      TenantKey: this.tenantKey,
      MetaData: people.metadata,
      Address: people.address,
      TypeId: '1'
    };
    return this.http.post<CreateEditPeople>(ApiService.baseApiUrl('people'), body, {headers: this.httpHeaders});
  }

  createPeopleIdentifiers(personId: any, identifiersId: Identifiers): Observable<any> {
    return this.http.put(ApiService.baseApiUrl(`people/${personId}/identifiers`), identifiersId, {headers: this.httpHeaders});
  }

  editPeople(people): Observable<CreateEditPeople> {
    return this.http.patch<CreateEditPeople>(ApiService.baseApiUrl(`people/${people.id}`), this.convertBody(people), {headers: this.httpHeaders});
  }

  createEditPeopleGroups(personId: string, newGroups: CreateRemoveGroups): Observable<any> {
    return this.http.put<any>(ApiService.baseApiUrl(`people/${personId}/groups `), newGroups, {headers: this.httpHeaders});
  }

  removePeople(peopleId): Observable<any> {
    return this.http.delete(ApiService.baseApiUrl(`people/${peopleId}`), {headers: this.httpHeaders});
  }

  removeGroupPeople(peopleId: string, groupId: string | Array<string>): Observable<any> {
    return this.http.delete(ApiService.baseApiUrl(`people/${peopleId}/groups/${groupId}`), {headers: this.httpHeaders});
  }

  async addPeopleToCompanies(peopleId, companyIds: number[]) {
    const ret = {totalCount: companyIds.length, successCount: 0, failedCount: 0};
    try {
      for (const item of companyIds) {
        const res = await this.addPeopleToCompany(peopleId, item).toPromise() as any;
        if (res.success) {
          ret.successCount += 1;
        } else {
          ret.failedCount += 1;
        }
      }
      return ret;
    } catch (e) {

    } finally {

    }
    return ret;
  }

  addPeopleToCompany(peopleId, companyId): Observable<any> {
    return this.http.post(ApiService.baseApiUrl(`people/${peopleId}/company/${companyId}`), null)
      .pipe(
        map(x => of({success: true, res: x})),
        catchError(err => of({success: false, res: null}))
      );
  }

  uploadPeoplePhoto(peopleId, file): Observable<any> {
    const header = new HttpHeaders();
    header.append('Content-Type', 'multipart/form-data');
    return this.http.post(ApiService.baseApiUrl('images'), file, {headers: header});
  }

  private convertBody(people): Array<any> {
    const body = [
      {op: 'replace', path: '/firstName', value: people.firstName},
      {op: 'replace', path: '/lastName', value: people.lastName},
      {op: 'replace', path: '/email', value: people.email},
      {op: 'replace', path: '/tenantKey', value: this.tenantKey},
      {op: 'replace', path: '/metaData', value: people.metadata},
    ];
    return body;
  }
}
