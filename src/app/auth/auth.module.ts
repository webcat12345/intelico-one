import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { AuthRoutingModule } from './auth-routing.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneNotificationsModule } from '@one-common/notifications';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';
import { OrgSelectComponent } from './components/org-select/org-select.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    TabsModule.forRoot(),
    LoaderModule,
    OneNotificationsModule
  ],
  exports: [],
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    LoginFormComponent,
    SignupFormComponent,
    TwoFactorAuthComponent,
    OrgSelectComponent,
    LoadingComponent,
    RegisterComponent,
    ResetPasswordFormComponent,
  ]
})
export class AuthModule {
}
