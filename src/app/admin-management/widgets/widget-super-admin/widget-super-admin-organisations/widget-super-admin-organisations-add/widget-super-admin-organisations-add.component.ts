import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IUser, IUserList, UserService } from '@one-core/service/user.service';
import { IOrganisation, OrganisationService } from '@one-core/service/organisation.service';
import { AdminManagementService } from '../../../../services/admin-management.service';
import { ToastrService } from '../../../../services/toastr.service';
import { WindowName } from '../../../../meta/admin-meta';

@Component({
  selector: 'one-admin-widget-super-admin-organisations-add',
  templateUrl: './widget-super-admin-organisations-add.component.html',
  styleUrls: ['./widget-super-admin-organisations-add.component.scss']
})
export class WidgetSuperAdminOrganisationsAddComponent implements OnInit, OnDestroy {

  @Input() selectedOrganisation: IOrganisation;
  @Input() isNew: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() openSwitchModal: EventEmitter<any> = new EventEmitter<any>();

  isLoading = false;
  isUsersLoading = false;
  isCurrentOrgAdminsLoading = false;

  organisation: IOrganisation = {id: '', name: '', users: 0, sites: 0, tenantKey: ''};
  existingUsers: IUser[] = [];
  selectedUser: IUser = {id: '', firstName: '', lastName: '', email: '', role: ''};

  userList: IUser[] = [];
  store$: Subscription = new Subscription();

  constructor(
    private organisationService: OrganisationService,
    private userService: UserService,
    private adminService: AdminManagementService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedOrganisation) {
      if (this.selectedOrganisation.id) {
        this.organisation = JSON.parse(JSON.stringify(this.selectedOrganisation));
        if (this.organisation.users) {
          this.getOrgAdmins(this.organisation.id);
        } else {
          // this.getExistingUsers();
        }
      }
    } else {
      // this.getExistingUsers();
    }
    this.store$ = this.adminService.associationStore$.subscribe((res: IUser) => {
      res.password = 'P@s$word123';
      this.userList.push(res);
    });
  }

  ngOnDestroy() {
    this.store$.unsubscribe();
  }

  openSubwindow() {
    this.adminService.openAdminSubWindow(WindowName.AdminUser, true);
  }

  onSelectUser(e: NgModel): void {
    const index = this.existingUsers.findIndex(x => x.id === this.selectedUser.id);
    if (index > -1) {
      this.selectedUser = {id: '', firstName: '', lastName: '', email: '', role: ''};
      this.existingUsers[index].isNewEntry = true;
      this.userList.push(this.existingUsers[index]);
      this.existingUsers.splice(index, 1);
      e.control.markAsPristine();
    }
  }

  async onRemoveFromList(user, index) {
    try {
      this.isLoading = true;
      if (!user.isNewEntry) {
        await this.organisationService.removeUserFromOrg(this.organisation.id, user.id).toPromise();
      }
      this.userList.splice(index, 1);
      this.existingUsers.push(user);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  async getExistingUsers() {
    try {
      this.isUsersLoading = true;
      const res = await this.userService.getAdminUsers().toPromise() as IUserList;
      this.existingUsers = res.data;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isUsersLoading = false;
    }
  }

  async getOrgAdmins(id) {
    try {
      this.isCurrentOrgAdminsLoading = true;
      this.isUsersLoading = true;
      const user_res = await this.organisationService.getOrgAdminUsers(id).toPromise() as IUserList;
      // const res = await this.userService.getAdminUsers().toPromise() as IUserList;
      this.userList = user_res.data;
      // this.existingUsers = res.data;
      // this.existingUsers = this.existingUsers.filter(x => {
      //   const index = this.userList.findIndex(y => y.id === x.id);
      //   return index > -1 ? false : true;
      // });
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isUsersLoading = false;
      this.isCurrentOrgAdminsLoading = false;
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        delete this.organisation.id;
        this.organisation.tenantKey = String(Date.now());
        await this.organisationService.createOrganisation(this.organisation).toPromise();
        this.openSwitchModal.emit();
        this.toastr.success('New organisation has been created');
        this.close.emit({success: true, isNew: true, data: null});
      } else {
        await this.editOrganisation();
        this.toastr.success('Organisation has been updated');
        this.close.emit({success: true, isNew: false, data: null});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  async editOrganisation() {
    const body = [
      {path: '/name', op: 'replace', value: this.organisation.name}
    ];
    await this.organisationService.editOrganisation(this.organisation.id, body).toPromise();
  }
}
