import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { fly_ErrorMessage } from '@one-animation/common.animations';
import { AuthService } from '../../services/auth.service';
import { IForgotPasswordForm } from '../../../core/models/authentication';

@Component({
  selector: 'one-admin-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  animations: [
    fly_ErrorMessage()
  ]
})

export class ResetPasswordFormComponent implements OnInit {

  forgotPasswordForm = {
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
    confirmPassword: {
      value: '',
      isError: false,
      errorMsg: ''
    },
    code: {
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
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.forgotPasswordForm.email.value = this.route.snapshot.queryParams.email;
  }

  async resetPassword(form: NgForm) {
    try {
      if (form.form.valid) {
        if (form.controls.password.value !== form.controls.confirmPassword.value) {
          this.forgotPasswordForm.confirmPassword.isError = true;
          this.forgotPasswordForm.confirmPassword.errorMsg = 'Password and Confirm Password mis matched';
          return;
        }
        this.isLoading = true;
        const body: IForgotPasswordForm = {
          email: this.forgotPasswordForm.email.value,
          password: this.forgotPasswordForm.password.value,
          confirmPassword: this.forgotPasswordForm.confirmPassword.value,
          code: decodeURI(this.route.snapshot.params.token)
        };
        await this.authService.resetPassword(body);
        this.router.navigate(['/login']);
      } else {
        this.forgotPasswordForm.email.isError = !form.controls.email.valid;
        this.forgotPasswordForm.email.errorMsg = this.forgotPasswordForm.email.isError ? 'Please type correct Email address.' : '';
        this.forgotPasswordForm.password.isError = !form.controls.password.valid;
        this.forgotPasswordForm.password.errorMsg = this.forgotPasswordForm.password.isError ? 'Password must be 4 characters.' : '';
        this.forgotPasswordForm.confirmPassword.isError = !form.controls.confirmPassword.valid;
        this.forgotPasswordForm.confirmPassword.errorMsg = this.forgotPasswordForm.confirmPassword.isError ? 'Confirm Password must be 4 characters.' : '';
      }
    } catch (e) {
      this.forgotPasswordForm.general = {isError: true, errorMsg: e.message};
    } finally {
      this.isLoading = false;
    }
  }

  onFormChanges() {
    this.forgotPasswordForm.email.errorMsg = '';
    this.forgotPasswordForm.email.isError = false;
    this.forgotPasswordForm.password.errorMsg = '';
    this.forgotPasswordForm.password.isError = false;
    this.forgotPasswordForm.confirmPassword.errorMsg = '';
    this.forgotPasswordForm.confirmPassword.isError = false;
    this.forgotPasswordForm.general.isError = false;
    this.forgotPasswordForm.general.errorMsg = '';
  }


}
