import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonService } from '@one-core/service/common.service';
import { IUser, IUserList, UserService } from '@one-core/service/user.service';
import { OrganisationService } from '@one-core/service/organisation.service';
import { ToastrService } from '../../../services/toastr.service';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { AddStep } from './widget-admin-user.enum';
import { parseUserRoleNumber, UserRole, UserRoleLabel } from '../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-user',
  templateUrl: './widget-admin-user.component.html',
  styleUrls: ['./widget-admin-user.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetAdminUserComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  info: Array<TableInfo> = [
    {label: 'Name', name: 'fullName', width: '20%', isLink: false},
    {label: 'Login Email', name: 'email', width: '', isLink: false},
    {label: 'Role', name: 'role', width: '20%', isLink: false},
    {label: 'Phone', name: 'mobile', width: '20%', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  UserRole = UserRole;
  enum_AddStep = AddStep;
  addStep = AddStep.Search;
  showAddModal = false;

  isLoading = false;
  isAddModal = false;
  searchKey = '';

  noMatch = false;
  createdUserName = '';
  selectedPerson: IUser = null;
  searchResult: IUser = null;
  userList: IUserList = {data: [], totalCount: 0};

  showConfirmModal = false;
  selectedUser = null;

  roles: Array<any> = [
    {label: UserRoleLabel.Admin, value: UserRole.Admin},
    {label: UserRoleLabel.NormalUser, value: UserRole.Operator}, // operator is same as normal user for beta release
    {label: UserRoleLabel.NormalUser, value: UserRole.User},
  ];

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private organisationService: OrganisationService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    if (this.isAddWindow) {
      this.isAddModal = true;
      this.showAddModal = true;
      this.addStep = AddStep.Search;
    } else {
      this.getUsers();
    }
  }

  async onDelete(flag) {
    if (flag) {
      try {
        this.isLoading = true;
        await this.organisationService.removeUserFromOrg(this.commonService.organisation.id, this.selectedUser.userId).toPromise();
        await this.getUsers();
      } catch (e) {
        this.toastr.error(null, e);
      } finally {
        this.showConfirmModal = false;
        this.isLoading = false;
      }
    } else {
      this.selectedUser = null;
      this.showConfirmModal = false;
    }
  }

  async removeUser(e) {
    this.showConfirmModal = true;
    this.selectedUser = e;
  }

  async getUsers() {
    try {
      this.isLoading = true;
      this.userList = await this.organisationService.getOrgUsers(this.commonService.organisation.id).toPromise() as IUserList;
      this.userList.data.map((item) => {
        item.fullName = item.firstName + ' ' + item.lastName;
        item.role = parseUserRoleNumber(item.userType);
      });
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onEditUser(e) {
    this.selectedPerson = e;
    this.addStep = AddStep.Edit;
    this.showAddModal = true;
  }

  onCloseAddSection(e) {
    this.resetStore();
    if (e.isNew) {
      setTimeout(() => {
        this.getUsers();
        this.showAddModal = false;
        this.addStep = AddStep.Search;
      }, 1000);
      this.addStep = AddStep.Invitation;
    } else {
      this.searchResult = e.res;
      this.addStep = AddStep.SearchResult;
    }
  }

  onCloseSearchResultSection(e) {
    this.resetStore();
    if (e.isNew) {
      this.noMatch = true;
      this.addStep = AddStep.Search;
    } else {
      this.selectedPerson = e.res;
      this.addStep = AddStep.Edit;
    }
  }

  onCloseEditSection(e) {
    this.resetStore();
    this.showAddModal = false;
    this.addStep = AddStep.Search;
    this.getUsers();
  }

  resetStore() {
    this.noMatch = false;
    this.searchResult = null;
    this.selectedPerson = null;
  }

  onClosePanel() {
    this.resetStore();
    this.addStep = AddStep.Search;
    this.showAddModal = false;
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }
}
