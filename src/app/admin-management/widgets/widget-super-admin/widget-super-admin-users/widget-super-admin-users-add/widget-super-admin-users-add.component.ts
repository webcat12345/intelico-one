import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IUser, UserService } from '@one-core/service/user.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-users-add',
  templateUrl: './widget-super-admin-users-add.component.html',
  styleUrls: ['./widget-super-admin-users-add.component.scss']
})
export class WidgetSuperAdminUsersAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedUser: IUser;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  user: IUser = {id: '', firstName: '', lastName: '', role: 'Super Admin', email: ''};

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedUser) {
      if (this.selectedUser.id) {
        this.user = JSON.parse(JSON.stringify(this.selectedUser));
      }
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        this.user.password = 'P@s$word123';
        const res = await this.userService.createUser(this.user).toPromise() as IUser;
        if (res.id) {
          this.toastr.success('Successfully created a new user');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        // await this.userService.editUser(this.user).toPromise();
        this.toastr.success('Successfully updated');
        this.close.emit({success: true, isNew: false, data: this.user});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
