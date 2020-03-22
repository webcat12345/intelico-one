import { Component, OnInit } from '@angular/core';

import { TypesService } from '@one-core/service/types.service';
import { IUser, IUserList, UserService } from '@one-core/service/user.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { flyIn } from '@one-animation/flyIn.animation';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-users',
  templateUrl: './widget-super-admin-users.component.html',
  styleUrls: ['./widget-super-admin-users.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminUsersComponent implements OnInit {

  info: Array<TableInfo> = [
    {label: 'First Name', name: 'firstName', width: '25%', isLink: false},
    {label: 'Last Name', name: 'lastName', width: '25%', isLink: false},
    {label: 'Email', name: 'email', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];
  showAddModal = false;
  isLoading = false;
  isAddModal = false;
  selectedUser: IUser = null;
  searchKey = '';
  userList: IUserList = {data: [], totalCount: 0};

  constructor(
    private toastr: ToastrService,
    private typeService: TypesService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    try {
      this.isLoading = true;
      this.userList = await this.userService.getIntelicoUsers().toPromise() as IUserList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateUser(): void {
    this.isAddModal = true;
    this.selectedUser = null;
    this.showAddModal = true;
  }

  onEditUser(e): void {
    this.isAddModal = false;
    this.selectedUser = e;
    this.showAddModal = true;
  }

  async onRemoveUser(e) {
    try {
      this.isLoading = true;
      await this.userService.removeUser(e.id).toPromise();
      await this.getUsers();
      this.toastr.success('User deleted');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      if (action.isNew) {
        this.userList.totalCount += 1;
        this.userList.data.push(action.data);
      } else {
        const index = this.userList.data.findIndex(x => x.id === action.data.id);
        if (index > -1) {
          this.userList.data[index] = action.data;
        } else {
          this.getUsers();
        }
      }
    }
    this.showAddModal = false;
  }
}
