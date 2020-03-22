import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AgmCoreModule } from '@agm/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HotkeyModule } from 'angular2-hotkeys';

import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './state/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './state/effects/app.effects';
import { NotificationEffects } from './state/effects/notification.effects';
import { ResourceEffects } from './state/effects/resource.effects';

import { AuthInterceptor } from './core/interceptors/auth-interceptor.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    LocalStorageModule.forRoot({prefix: environment.localStorage.prefix, storageType: 'localStorage'}),
    AgmCoreModule.forRoot({apiKey: environment.agmAPIKey}),
    HotkeyModule.forRoot(),
    // DxDateBoxModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    EffectsModule.forRoot([ResourceEffects]),
    EffectsModule.forFeature([NotificationEffects]),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
