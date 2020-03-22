import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ITeam, TeamService } from '@one-core/service/team.service';
import { IUser, IUserList } from '@one-core/service/user.service';
import { ToastrService } from '../../../../services/toastr.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { CommonService } from '@one-core/service/common.service';
import { OrganisationService } from '@one-core/service/organisation.service';
import { parseUserRoleNumber } from '../../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-team-add',
  templateUrl: './widget-admin-team-add.component.html',
  styleUrls: ['./widget-admin-team-add.component.scss']
})
export class WidgetAdminTeamAddComponent implements OnInit, OnDestroy {

  @Input() isNew: boolean;
  @Input() selectedTeam: ITeam;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  team: ITeam = {id: 0, name: '', description: '', teamUsers: []};
  users: any[] = [];
  allUsers: IUser[];
  teamUsers: Array<any> = [];
  selectedUserId: any;

  info: Array<TableInfo> = [
    {label: '', name: 'name', width: '', isLink: false},
    {label: '', name: 'role', width: '125px', isLink: false},
    {label: '', name: 'action_group', width: '70px', isLink: false}
  ];
  private unsubscribe = new Subject<void>();

  constructor(
    private teamService: TeamService,
    private commonService: CommonService,
    private organisationService: OrganisationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedTeam) {
      if (this.selectedTeam.id > 0) {
        this.team = JSON.parse(JSON.stringify(this.selectedTeam));
      }
    }
    this.initUsers();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initUsers() {
    this.isLoading = true;
    this.teamUsers = [];
    this.users = [];
    if (this.commonService && this.commonService.organisation && this.commonService.organisation.id) {
      this.organisationService.getOrgUsers(this.commonService.organisation.id).subscribe((res: IUserList) => {
        this.isLoading = false;
        if (res && res.data) {
          this.allUsers = res.data;
          if (this.allUsers && this.allUsers.length && this.team && this.team.teamUsers && this.team.teamUsers.length) {
            this.team.teamUsers.forEach((teamUser) => {
              const user = this.allUsers.find((entry) => entry.userId === teamUser.userId);
              if (user && user.userId) {
                this.teamUsers.push(
                  {userId: user.userId, name: this.getFullName(user), role: parseUserRoleNumber(user.userType)}
                );
              }
            });
          }
          this.setUsers(this.getFilteredAllUsers());
        }
      }, (err) => {
        this.toastr.error(null, err);
        this.isLoading = false;
      });
    }
  }

  setUsers(users) {
    this.users = [
      ...
        users.map((user) => {
          return {
            userId: user.userId,
            name: this.getFullName(user)
          };
        })
    ];
  }

  getFullName(user: IUser) {
    return user ? `${user.firstName} ${user.lastName}  -  ${user.email}` : null;
  }

  getFilteredAllUsers() {
    if (this.allUsers && this.teamUsers) {
      return this.allUsers.filter((user) => {
        const isAdded = this.teamUsers.find((teamUser) => teamUser.userId === user.userId);
        return isAdded ? false : true;
      });
    } else {
      return [];
    }
  }

  addUser() {
    if (this.selectedUserId && this.allUsers) {
      const user = this.allUsers.find((person) => person.userId === this.selectedUserId);
      if (user) {
        const exists = this.teamUsers.find((teamUser) => teamUser.userId === user.userId);
        if (!exists) {
          this.teamUsers.push(
            {userId: user.userId, name: this.getFullName(user), role: parseUserRoleNumber(user.userType)}
          );
          this.setUsers(this.getFilteredAllUsers());
        }
      }
    }
    this.selectedUserId = null;
  }

  onRemove(user) {
    if (user && user.userId && this.teamUsers) {
      this.teamUsers = this.teamUsers.filter((teamUser) => teamUser.userId !== user.userId);
      this.setUsers(this.getFilteredAllUsers());
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (this.isNew) {
      this.teamService.createTeam(this.team).subscribe((res: ITeam) => {
        if (res.id > 0) {
          if (this.teamUsers && this.teamUsers.length) {
            this.addTeamUsers(res.id, this.teamUsers, 'Successfully created a new team', true, true);
          } else {
            this.emitResult('Successfully created a new team', true, true, res);
          }
        } else {
          this.isLoading = false;
          this.toastr.error(null);
        }
      }, (err) => {
        this.toastr.error(null, err);
        this.isLoading = false;
      });
    } else {
      this.teamService.editTeam(this.team).subscribe(() => {
        if (this.team.teamUsers && this.team.teamUsers.length) {
          if (this.teamUsers && this.teamUsers.length) {
            const removedIds = [];
            this.team.teamUsers.forEach((teamUser) => {
              const user = this.teamUsers.find((entry) => entry.userId === teamUser.userId);
              if (!user) {
                removedIds.push(teamUser.id);
              }
            });
            const addedUsers = [];
            this.teamUsers.forEach((teamUser) => {
              const user = this.team.teamUsers.find((entry) => entry.userId === teamUser.userId);
              if (!user) {
                addedUsers.push(teamUser);
              }
            });
            if (addedUsers.length && !removedIds.length) {
              this.addTeamUsers(this.team.id, addedUsers, 'Successfully updated the team', true, false, this.team);
            } else if (!addedUsers.length && removedIds.length) {
              this.removeTeamUsers(removedIds, 'Successfully updated the team', this.team);
            } else if (addedUsers.length && removedIds.length) {
              forkJoin({
                added: this.teamService.addTeamUsers(
                  addedUsers.map((teamUser) => {
                    return {userId: teamUser.userId, teamId: this.team.id};
                  })
                ),
                removed: this.teamService.removeTeamUsers(removedIds)
              }).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
                this.emitResult('Successfully updated the team', true, false, this.team);
              }, (err) => {
                this.toastr.error(null, err);
                this.isLoading = false;
              });
            } else {
              this.emitResult('Successfully updated the team', true, false, this.team);
            }
          } else {
            this.removeTeamUsers(
              this.team.teamUsers.map((teamUser) => teamUser.id),
              'Successfully updated the team',
              this.team
            );
          }
        } else {
          if (this.teamUsers && this.teamUsers.length) {
            this.addTeamUsers(this.team.id, this.teamUsers, 'Successfully updated the team', true, false, this.team);
          } else {
            this.emitResult('Successfully updated the team', true, false, this.team);
          }
        }
      }, (err) => {
        this.toastr.error(null, err);
        this.isLoading = false;
      });
    }
  }

  emitResult(message: string, success: boolean, isNew: boolean, data: any) {
    this.isLoading = false;
    this.toastr.success(message);
    this.close.emit({success, isNew, data});
  }

  addTeamUsers(teamId: number, teamUsers: any, message: string, success: boolean, isNew: boolean, team = null) {
    this.teamService.addTeamUsers(
      teamUsers.map((teamUser) => {
        return {userId: teamUser.userId, teamId};
      })
    ).subscribe((res) => {
      this.emitResult(message, success, isNew, team || res);
    }, (err) => {
      this.toastr.error(null, err);
      this.isLoading = false;
    });
  }

  removeTeamUsers(ids: number[], message: string, team = null) {
    this.teamService.removeTeamUsers(ids).subscribe((res) => {
      this.emitResult(message, true, false, team || res);
    }, (err) => {
      this.toastr.error(null, err);
      this.isLoading = false;
    });
  }

  updateTeamUsers() {

  }

}
