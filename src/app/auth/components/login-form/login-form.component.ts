import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// One - Services
import { AuthService } from '../../services/auth.service';
import { ILogin } from '../../../core/models/authentication';
import { CommonService } from '@one-core/service/common.service';
import { fly_ErrorMessage } from '@one-animation/common.animations';

@Component({
  selector: 'one-admin-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [
    fly_ErrorMessage()
  ]
})
export class LoginFormComponent {

  loginForm = {
    email: {
      value: '',
      isError: false,
      errorMsg: ''
    },
    password: {
      value: '',
      isError: false,
      errorMsg: ''
    },
    general: {
      isError: false,
      errorMsg: ''
    }
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
  ) {
  }

  login(form: NgForm) {
    if (form.form.valid) {
      this.isLoading = true;
      const body: ILogin = {email: this.loginForm.email.value, password: this.loginForm.password.value};
      this.authService.login(body).then(
        (res) => this.router.navigate(['/organization-select'])
      ).catch(
        (e) => this.loginForm.general = {isError: true, errorMsg: e.message}
      ).finally(() => this.isLoading = false);
    } else {
      this.loginForm.email.isError = !form.controls.email.valid;
      this.loginForm.email.errorMsg = this.loginForm.email.isError ? 'Please type correct Email address.' : '';
      this.loginForm.password.isError = !form.controls.password.valid;
      this.loginForm.password.errorMsg = this.loginForm.password.isError ? 'Password must be 4 characters.' : '';
    }
  }

  onFormChanges(): void {
    this.loginForm.email.errorMsg = '';
    this.loginForm.email.isError = false;
    this.loginForm.password.errorMsg = '';
    this.loginForm.password.isError = false;
    this.loginForm.general.isError = false;
    this.loginForm.general.errorMsg = '';
  }

}
