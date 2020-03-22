import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// Services
import { ApiService } from '../../core/interceptors/api.service';
import { environment } from '../../../environments/environment';
import { PersonalSettings } from '../models';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';

export interface IThemeUpload {
  id?: any;
  entityType: any;
  entityId?: string;
  fileUrl?: string;
  files?: FileList;
  position: any;
}

export interface DownloadThemes {
  data: Array<IThemeUpload>;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalSettingsService {
  settings: PersonalSettings;
  changeSettingsSubject = new Subject<any>();
  changeSettings$ = this.changeSettingsSubject.asObservable();
  protected httpHeaders: HttpHeaders = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.settings = new PersonalSettings();
    this.httpHeaders.append('Content-Type', 'multipart/form-data');
  }

  saveSettings(settings: PersonalSettings) {
    this.settings = settings;
    this.localStorageService.set(environment.personalSettings, this.settings);
    this.changeSettingsSubject.next(true);
  }

  loadSettings(): PersonalSettings {
    this.settings = this.localStorageService.get(environment.personalSettings) as PersonalSettings;
    return this.settings ? this.settings : new PersonalSettings();
  }

  getPersonalThemes(userId: string): Observable<DownloadThemes> {
    return this.http.get<DownloadThemes>(ApiService.baseApiUrl('images'), {
      headers: this.httpHeaders,
      params: new HttpParams()
        .set('pageNumber', '0')
        .set('RecordCount', '100')
        .set('OrderBy', 'createdDate')
        .set('filterBy', `type eq "7" and typeId eq " ${userId}"`)
    });
  }

  deletePersonalTheme(imageId: string): Observable<any> {
    return this.http.delete<any>(ApiService.baseApiUrl(`images/${imageId}`), {headers: this.httpHeaders});
  }

  uploadTheme(themeFile: IThemeUpload): Observable<IThemeUpload[]> {
    const body = new FormData();
    body.append('EntityType', themeFile.entityType);
    body.append('EntityId', themeFile.entityId);
    body.append('files', themeFile.files.item(0));
    body.append('Position', themeFile.position);
    return this.http.post<IThemeUpload[]>(ApiService.baseApiUrl(`images`), body, {headers: this.httpHeaders});
  }
}
