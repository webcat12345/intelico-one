import { Component, OnInit } from '@angular/core';

import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { ITeam, ITeamList, TeamService } from '@one-core/service/team.service';
import { ToastrService } from '../../../services/toastr.service';
import { paginationSetting } from '../../../meta/pagination-meta';
import { UserRole } from '../../../../core/models/authentication';

@Component({
  selector: 'one-admin-widget-admin-team',
  templateUrl: './widget-admin-team.component.html',
  styleUrls: ['./widget-admin-team.component.scss'],
  animations: [
    flyIn(300, 330, true)
  ]
})
export class WidgetAdminTeamComponent implements OnInit {

  UserRole = UserRole;
  showAddModal = false;
  showConfirmModal = false;
  isLoading = false;
  isAddModal = false;
  searchKey = '';
  selectedTeam: ITeam = null;
  teamList: any = {data: [], totalCount: 0};

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '30%', isLink: false},
    {label: 'Description', name: 'description', width: '30%', isLink: false},
    {label: 'Users', name: 'totalUsers', width: '15%', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  currentPage = 1;
  itemsPerPage: number = paginationSetting.itemsPerPage;

  constructor(
    private toastr: ToastrService,
    private teamService: TeamService
  ) {
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.isLoading = true;
    this.teamService.getTeamsByTenant().subscribe((res: ITeamList) => {
      if (res) {
        this.teamList.totalCount = res.totalCount;
        if (res.data) {
          this.teamList.data = res.data.map((team) => {
            return {
              id: team.id,
              name: team.name,
              description: team.description,
              tenantKey: team.tenantKey,
              teamUsers: team.teamUsers,
              totalUsers: team.teamUsers ? team.teamUsers.length : 0
            };
          });
        }
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(null, err);
    });
  }

  onCreateTeam(): void {
    this.isAddModal = true;
    this.selectedTeam = null;
    this.showAddModal = true;
  }

  onEditTeam(e): void {
    this.isAddModal = false;
    this.selectedTeam = e;
    this.showAddModal = true;
  }

  onDeleteConfirm(e): void {
    this.showConfirmModal = true;
    this.selectedTeam = e;
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.fetch();
    }
    this.showAddModal = false;
  }

  onRemoveTeam(flag): Promise<void> {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedTeam = null;
      return;
    }
    this.isLoading = true;
    this.teamService.removeTeam(this.selectedTeam.id).subscribe(() => {
      this.toastr.success('Team is deleted.');
      this.reset();
      this.fetch();
    }, (err) => {
      this.reset();
      this.toastr.error(null, err);
    });
  }

  reset() {
    this.isLoading = false;
    this.showConfirmModal = false;
    this.selectedTeam = null;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.fetch();
  }

}
