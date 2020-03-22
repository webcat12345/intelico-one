import { Component, OnInit } from '@angular/core';

import { AgentService, IAgent, IAgentList } from '@one-core/service/agent.service';
import { ToastrService } from '../../../services/toastr.service';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';

@Component({
  selector: 'one-admin-widget-super-admin-input-agents',
  templateUrl: './widget-super-admin-input-agents.component.html',
  styleUrls: ['./widget-super-admin-input-agents.component.scss'],
  animations: [flyIn(300, 330, true)]
})
export class WidgetSuperAdminInputAgentsComponent implements OnInit {

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '', isLink: false},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  showAddModal = false;
  isAddModal = false;
  isLoading = false;
  searchKey = '';
  selectedAgent: IAgent = null;
  agentList: IAgentList = {data: [], totalCount: 0};

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getAgents();
  }

  async getAgents() {
    try {
      this.isLoading = true;
      this.agentList = await this.agentService.getAgents().toPromise() as IAgentList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateAgent(): void {
    this.isAddModal = true;
    this.selectedAgent = null;
    this.showAddModal = true;
  }

  onEditAgent(e): void {
    this.isAddModal = false;
    this.selectedAgent = e;
    this.showAddModal = true;
  }

  async onRemoveAgent(e) {
    try {
      this.isLoading = true;
      await this.agentService.removeAgent(e.id).toPromise();
      await this.getAgents();
      this.toastr.success('Agent deleted.');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      if (action.isNew) {
        this.agentList.totalCount += 1;
        this.agentList.data.push(action.data);
      } else {
        const index = this.agentList.data.findIndex(x => x.id === action.data.id);
        if (index > -1) {
          this.agentList.data[index] = action.data;
        } else {
          this.getAgents();
        }
      }
    }
    this.showAddModal = false;
  }
}
