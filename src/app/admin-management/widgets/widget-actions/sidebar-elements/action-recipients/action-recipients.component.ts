import { Component, OnDestroy, OnInit } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '@one-core/service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { wait } from '../../../../../core/utils/common.util';
import { CommonService } from '@one-core/service/common.service';
import { ToastrService } from '../../../../services/toastr.service';
import { ActionStateService } from '../../services/action-state.service';
import { OrganisationService } from '@one-core/service/organisation.service';
import { ITypesReport } from '../../../widget-alerts/alerts-reports/alerts-reports.component';

interface UserViewModel extends IUser {
  selected: boolean;
}

export interface ITeam {
  id: number;
  name: string;
  description: string;
  parentId: number;
  tenantKey: string;
  selected: boolean;
  teamUsers: Array<any>;
}

@Component({
  selector: 'one-admin-action-recipients',
  templateUrl: './action-recipients.component.html',
  styleUrls: ['./action-recipients.component.scss']
})
export class ActionRecipientsComponent implements OnInit, OnDestroy {

  isLoading = false;
  stepInfo: any = {};
  isUsersLoading = false;
  users: UserViewModel[] = [];
  teamsUsers: ITeam[] = [];
  teamsUsersUI: ITeam[] = [];
  usersUI: UserViewModel[] = [];
  isTeamsUsers: boolean;
  selectedUser = '-1'; // just for modeling

  sendAlertsTo: FormGroup = this.fb.group({
    type_send_alert: ['default']
  });
  typesSendAlertsTo: Array<ITypesReport> = [
    {id: 1, value: 'Individual'},
    {id: 2, value: 'Team'},
  ];
  private unsubscribe = new Subject<void>();

  constructor(
    public actionStateService: ActionStateService,
    private orgService: OrganisationService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getUsers();
    this.getTeams();
    this.sendAlertsTo.get('type_send_alert').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((id) => {
      if (+id === 2) {
        this.isTeamsUsers = true;
        this.usersUI = [];
        this.teamsUsersUI = [];
        this.selectedUser = '-1';
        this.teamsUsersUI = this.teamsUsers;
      } else {
        this.isTeamsUsers = false;
        this.usersUI = [];
        this.teamsUsersUI = [];
        this.users.map(item => {
          this.usersUI.push(item);
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async onSelectUser(e) {
    this.selectedUser = e;
    if (!this.isTeamsUsers) {
      const index = this.users.findIndex(x => +x.id === +this.selectedUser);
      if (index > -1) {
        this.users[index].selected = true;
        await wait(100);
        this.selectedUser = '-1'; // value -1 is for placeholder of select dropdown
        this.actionStateService.action.users = this.users.filter(x => x.selected);
      }
    } else {
      const index = this.teamsUsers.findIndex(x => +x.id === +this.selectedUser);
      if (index > -1) {
        // this.teamsUsersUI[index].selected = true;
        this.teamsUsers[index].selected = true;
        await wait(100);
        this.selectedUser = '-1'; // value -1 is for placeholder of select dropdown
        this.actionStateService.action.teams = this.teamsUsers.filter(x => x.selected);
      }
    }
  }

  deselectUser(userUI: UserViewModel) {
    userUI.selected = false;
    this.actionStateService.action.users = this.users.filter(x => x.selected);
  }

  deselectTeam(team: ITeam) {
    team.selected = false;
    this.actionStateService.action.teams.map((tem, index) => {
      if (team.id === tem.id) {
        this.actionStateService.action.teams.splice(index, 1);
      }
    });
  }

  async getUsers() {
    try {
      this.isUsersLoading = true;
      const res: any = await this.orgService.getOrgUsers(this.commonService.organisation.id).toPromise();
      this.users = res.data;
      this.usersUI = res.data;
      // recover selected users from the api response
      if (this.actionStateService.action && this.actionStateService.action.users) {
        //  this.sendAlertsTo.get('type_send_alert').setValue(1);
        this.actionStateService.action.users.map(x => {
          const index = this.users.findIndex(user => +x.id === +user.id);
          if (index > -1) {
            this.users[index].selected = true;
          }
        });
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isUsersLoading = false;
    }
  }

  async getTeams() {
    try {
      this.isUsersLoading = true;
      const res: any = await this.orgService.getOrgTeams().toPromise();
      this.teamsUsers = res.data;
      if (this.actionStateService.action && this.actionStateService.action.teams) {
        // this.sendAlertsTo.get('type_send_alert').setValue(2);
        this.actionStateService.action.teams.map(x => {
          const index = this.teamsUsers.findIndex(user => +x.id === +user.id);
          if (index > -1) {
            this.teamsUsers[index].selected = true;
          }
        });
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isUsersLoading = false;
    }
  }

  save() {
    this.isLoading = true;
    if (this.actionStateService.isEditModal) {
      this.actionStateService.editAction().subscribe(
        res => {
          this.actionStateService.changeStep(this.stepInfo.next);
          this.isLoading = false;
        }, error => {
          console.error(error);
        }
      );
    } else {
      this.actionStateService.saveAction().subscribe(
        res => {
          this.actionStateService.changeStep(this.stepInfo.next);
          this.isLoading = false;
        }, error => {
          console.error(error);
        }
      );
    }
  }

}
