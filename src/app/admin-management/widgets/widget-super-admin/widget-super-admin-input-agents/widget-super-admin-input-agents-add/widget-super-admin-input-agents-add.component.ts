import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgentService, IAgent } from '@one-core/service/agent.service';
import { ToastrService } from '../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-super-admin-input-agents-add',
  templateUrl: './widget-super-admin-input-agents-add.component.html',
  styleUrls: ['./widget-super-admin-input-agents-add.component.scss']
})
export class WidgetSuperAdminInputAgentsAddComponent implements OnInit {

  @Input() isNew: boolean;
  @Input() selectedAgent: IAgent;
  @Output() close: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  agent: IAgent = {id: 0, name: ''};

  constructor(
    private agentService: AgentService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    if (this.selectedAgent) {
      if (this.selectedAgent.id) {
        this.agent = JSON.parse(JSON.stringify(this.selectedAgent));
      }
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      if (this.isNew) {
        const res: IAgent = await this.agentService.createAgent(this.agent).toPromise() as IAgent;
        if (res.id) {
          this.toastr.success('Input Agent created.');
          this.close.emit({success: true, isNew: true, data: res});
        }
      } else {
        await this.agentService.editAgent(this.agent).toPromise();
        this.toastr.success('Input Agent updated.');
        this.close.emit({success: true, isNew: false, data: this.agent});
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

}
