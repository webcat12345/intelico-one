import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonService } from '@one-core/service/common.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected httpHeaders: HttpHeaders = new HttpHeaders();
  protected httpXWwwFormHeaders: HttpHeaders = new HttpHeaders();
  protected readApiDetailCode = environment.apis.readApiDetailCode;
  protected readApiListCode = environment.apis.readApiListCode;
  protected readApiLookupCode = environment.apis.readApiLookupCode;
  protected readApiReportCode = environment.apis.readApiReportCode;
  protected eventApiCreateCode = environment.apis.evenApiCreateCode;
  protected eventApiUpdateCode = environment.apis.evenApiUpdateCode;
  protected dialogFlowSessionCode = environment.apis.dialogFlowSessionCode;
  protected dialogFlowMessageCode = environment.apis.dialogFlowMessageCode;

  constructor(
    public http: HttpClient,
    public localStorageService: LocalStorageService,
    private commonService: CommonService
  ) {
    this.httpHeaders.append('Content-Type', 'application/json');
    this.httpXWwwFormHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  get tenantKey() {
    return this.commonService.tenantKey;
  }

  get currentUser() {
    return this.commonService.currentUser;
  }

  static readApiUrl(url): string {
    return `${environment.apis.readApi}/${url}`;
  }

  static baseApiUrl(url): string {
    return `${environment.apis.baseApi}/${url}`;
  }

  static eventApiUrl(url): string {
    return `${environment.apis.eventApi}/${url}`;
  }

  static dialogFlowApiUrl(url): string {
    return `${environment.apis.dialogFlow}/${url}`;
  }
}
