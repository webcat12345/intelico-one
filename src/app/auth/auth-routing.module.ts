import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';
import { OrgSelectComponent } from './components/org-select/org-select.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'reset_password', component: ResetPasswordComponent},
  {path: 'reset_password/:token', component: ResetPasswordFormComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'two-factor-login',
    component: TwoFactorAuthComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organization-select',
    component: OrgSelectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'loading',
    component: LoadingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
