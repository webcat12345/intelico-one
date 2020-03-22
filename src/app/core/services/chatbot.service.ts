import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../interceptors/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService extends ApiService {

  sessionKey = '';

  createSession() {
    const param = new HttpParams().set('code', this.dialogFlowSessionCode);
    const body = {
      tenantKey: this.tenantKey,
      channel: 'web',
    };
    return this.http.post(ApiService.dialogFlowApiUrl('session'), body, {params: param}).pipe(
      tap((res: any) => this.sessionKey = res.session)
    );
  }

  sendMessage(message) {
    const param = new HttpParams().set('code', this.dialogFlowMessageCode);
    const body = {
      session: this.sessionKey,
      text: message
    };
    return this.http.post(ApiService.dialogFlowApiUrl('message'), body, {params: param}).pipe(
      map((res: any) => res.reply)
    );
  }
}
