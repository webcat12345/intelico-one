import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ITeam, TeamService } from '@one-core/service/team.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-teams-add',
  templateUrl: './widget-super-admin-teams-add.component.html',
  styleUrls: ['./widget-super-admin-teams-add.component.scss']
})
export class WidgetSuperAdminTeamsAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedTeam: ITeam;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  team: ITeam = {id: 0, name: '', description: ''};

  constructor(
    private teamService: TeamService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedTeam) {
      if (this.selectedTeam.id > 0) {
        this.team = JSON.parse(JSON.stringify(this.selectedTeam));
      }
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        const res = await this.teamService.createTeam(this.team).toPromise() as ITeam;
        if (res.id > 0) {
          this.toastr.success('Successfully created a new team');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        await this.teamService.editTeam(this.team).toPromise();
        this.toastr.success('Successfully updated a new team');
        this.close.emit({success: true, isNew: false, data: this.team});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
