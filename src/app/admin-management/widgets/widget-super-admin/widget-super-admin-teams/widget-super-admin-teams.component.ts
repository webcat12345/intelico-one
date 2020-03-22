import { Component, OnInit } from '@angular/core';
// One - Services
import { flyIn } from '@one-animation/flyIn.animation';
import { ToastrService } from '../../../services/toastr.service';
import { ITeam, ITeamList, TeamService } from '@one-core/service/team.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';

@Component({
  selector: 'one-admin-widget-super-admin-teams',
  templateUrl: './widget-super-admin-teams.component.html',
  styleUrls: ['./widget-super-admin-teams.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminTeamsComponent implements OnInit {

  showAddModal = false;
  showConfirmModal = false;
  isLoading = false;
  searchKey = '';
  isAddModal = false;
  selectedTeam: ITeam = null;
  teamList: ITeamList = {data: [], totalCount: 0};

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '22%', isLink: false},
    {label: 'Description', name: 'description', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  constructor(
    private teamService: TeamService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getTeams();
  }

  async getTeams(): Promise<void> {
    try {
      this.isLoading = true;
      this.teamList = await this.teamService.getTeams().toPromise() as ITeamList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
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

  async onRemoveTeam(flag): Promise<void> {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedTeam = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.teamService.removeTeam(this.selectedTeam.id).toPromise();
      await this.getTeams();
      this.toastr.error('Team is deleted.');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
      this.showConfirmModal = false;
      this.selectedTeam = null;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getTeams();
    }
    this.showAddModal = false;
  }
}
