import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@one-core/service/common.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastrService } from '../../../services/toastr.service';
import { confirmPasswordValidator } from '../../../../core/utils/validators.util';

@Component({
  selector: 'one-admin-widget-settings-password-tab',
  templateUrl: './widget-settings-password-tab.component.html',
  styleUrls: ['./widget-settings-password-tab.component.scss']
})
export class WidgetSettingsPasswordTabComponent implements OnInit {

  isLoading = false;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator]],
      userId: this.commonService.userId
    });
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      const res = await this.authService.changePassword(this.passwordForm.value).toPromise();
      this.toastr.success('Password changed successfully.');
    } catch (e) {
      let errorMessage = 'Something went wrong. We can\'t reset your password. Please try again.';
      if (e && e.error.statusCode === 500 && e.error.errorMessage) {
        errorMessage = e.error.errorMessage;
      }
      if (e && e.error && e.error.errors && e.error.errors.length) {
        errorMessage = e.error.errors[0].message;
      }
      this.toastr.error(errorMessage, e);
    } finally {
      this.isLoading = false;
    }
  }

}
