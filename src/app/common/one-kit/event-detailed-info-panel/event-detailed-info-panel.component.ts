import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { ActionService } from '@one-core/service/action.service';
import { IPeopleList, PeopleService } from '@one-core/service/people.service';

@Component({
  selector: 'one-admin-event-detailed-info-panel',
  templateUrl: './event-detailed-info-panel.component.html',
  styleUrls: ['./event-detailed-info-panel.component.scss']
})
export class EventDetailedInfoPanelComponent implements OnInit {

  @Input() config: any = {};
  @Input() action: Array<any> = [];
  @Output() expand: EventEmitter<any> = new EventEmitter();
  metaDataKeys: Array<string> = [];
  metaDataValues: Array<string> = [];

  constructor(
    private actionService: ActionService,
    private peopleService: PeopleService
  ) {
  }

  ngOnInit() {
    if (this.config.data) {
      if (this.config.data.metaData) {
        this.metaDataValues = Object.values(this.config.data.metaData);
        this.metaDataKeys = Object.keys(this.config.data.metaData);
      }
      if (this.config.data.actionId) {
        const actionData = this.action.filter(x => x.id === this.config.data.actionId);
        if (actionData.length > 0) {
          this.config.data.action = actionData[0].action;
          this.config.data.nameAction = actionData[0].name;
          this.config.data.reason = actionData[0].reason;
          this.config.data.alertTypes = actionData[0].conditions;
          this.config.data.alertVia = actionData[0].alertTypes;
        }
      }
      if (this.config.data.peopleId) {
        this.peopleService.getPeople('').subscribe((resp: IPeopleList) => {
          if (resp.data.length > 0) {
            resp.data.map((item) => {
              if (item.id === this.config.data.peopleId) {
                this.config.data.personDetails = item;
              }
            });
          }
        });
      }
    }
  }

  onExpand(e) {
    e.stopPropagation();
    this.expand.emit();
  }
}
