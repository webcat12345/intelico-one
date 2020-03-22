import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fly_ErrorMessage } from '@one-animation/common.animations';

import { IForgotPassword } from '../../../core/models/authentication';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'one-admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [
    fly_ErrorMessage()
  ]
})
export class ResetPasswordComponent implements OnInit {

  forgetPasswordForm = {
    email: {
      value: '',
      isError: false,
      errorMsg: ''
    },
    general: {
      isError: false,
      errorMsg: ''
    }

  };

  isSuccess = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
  }

  async forgotPassword(form: NgForm) {
    try {
      if (form.form.valid) {
        this.isLoading = true;
        const body: IForgotPassword = {Email: this.forgetPasswordForm.email.value};
        await this.authService.forgotPassword(body);
        this.isSuccess = true;
      } else {
        this.forgetPasswordForm.email.isError = !form.controls.email.valid;
        this.forgetPasswordForm.email.errorMsg = this.forgetPasswordForm.email.isError ? 'Please type correct Email address.' : '';
      }
    } catch (e) {
      this.forgetPasswordForm.general = {isError: true, errorMsg: e.message};
    } finally {
      this.isLoading = false;
    }
  }

  onFormChanges() {
    this.forgetPasswordForm.email.errorMsg = '';
    this.forgetPasswordForm.email.isError = false;
    this.forgetPasswordForm.general.isError = false;
    this.forgetPasswordForm.general.errorMsg = '';
  }


}
