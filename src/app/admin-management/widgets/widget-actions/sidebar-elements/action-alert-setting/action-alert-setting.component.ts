import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// One - Services
import { map } from 'rxjs/operators';

import { Action, ActionTriggerType, Priority } from '@one-core/model';
import { TypeCategory, TypesService } from '@one-core/service/types.service';
import { ActionStateService } from '../../services/action-state.service';

@Component({
  selector: 'one-admin-action-alert-setting',
  templateUrl: './action-alert-setting.component.html',
  styleUrls: ['./action-alert-setting.component.scss']
})
export class ActionAlertSettingComponent implements OnInit {

  Priority = Priority;
  stepInfo: any = {};
  actionReason: any = {};
  isActionReason = true;
  actionReasonLoading = false;
  reasons: any[] = [];

  triggerForm: FormGroup;
  smsOption = false;
  phoneOption = false;
  whatsappOption = false;
  dashboardOption = false;
  sidebarOption = false;
  voiceOption = false;
  emailOption = false;
  teamOption = false;

  generalOption = true;

  constructor(
    public actionStateService: ActionStateService,
    private formBuilder: FormBuilder,
    private typeService: TypesService,
  ) {
  }

  ngOnInit() {
    this.initTriggerForm(this.actionStateService.action);
    this.actionReasonLoading = true;
    this.typeService.getTypes(TypeCategory.Reasons).pipe(map((x: any) => x.data)).subscribe((res) => {
      this.reasons = res;
      this.actionReasonLoading = false;
      if (!this.actionStateService.action.triggers.length) {
        this.actionStateService.action.triggers.push({name: ActionTriggerType.Dashboard}, {name: ActionTriggerType.Sidebar});
      }
      this.actionStateService.action.triggers.map(x => {
        if (x.name === ActionTriggerType.SMS) {
          this.onChangeOption(true, 'sms');
        }
        if (x.name === ActionTriggerType.Phone) {
          this.onChangeOption(true, 'phone');
        }
        if (x.name === ActionTriggerType.Dashboard) {
          this.onChangeOption(true, 'dashboard');
        }
        if (x.name === ActionTriggerType.Sidebar) {
          this.onChangeOption(true, 'sideBar');
        }
        if (x.name === ActionTriggerType.Email) {
          this.onChangeOption(true, 'email');
        }
        if (x.name === ActionTriggerType.Whatsapp) {
          this.onChangeOption(true, 'whatsApp');
        }
        if (x.name === ActionTriggerType.Voice) {
          this.onChangeOption(true, 'voice');
        }
      });
      if (this.actionStateService.action.actionReason) {
        if (typeof this.actionStateService.action.actionReason.id === 'number') {
          this.reasons.map((item) => {
            if (item.id === this.actionStateService.action.actionReason.id) {
              this.actionReason = {id: item.id, description: item.value};
              this.isActionReason = false;
              this.triggerForm.get('actionReason').setValue(item.id);
            }
          });
        }
      }
    }, (err) => {
      console.error(err);
      this.actionReasonLoading = false;
    });
  }

  onchangeActionReason(e) {
    this.reasons.map((item) => {
      if (item.id === e.id) {
        this.actionReason = {id: item.id, description: item.value};
        this.isActionReason = false;
      }
    });
    //  delete this.actionReason.category;
    //   delete this.actionReason.isDeleted;
  }

  initTriggerForm(action: Action) {
    this.triggerForm = this.formBuilder.group({
      triggers: [action.triggers || []],
      priority: [action.priority || 200, Validators.required],
      actionReason: [action.actionReason || {}, Validators.required]
    });
  }

  save() {
    this.actionStateService.saveNotificationTriggerForm(this.triggerForm.value, this.actionReason);
    this.actionStateService.changeStep(this.stepInfo.next);
  }

  onChangeOption(e, type: string) {
    this.setAlertsVia(e, type);
    const res = [];
    if (this.smsOption) {
      res.push({name: ActionTriggerType.SMS});
    }
    if (this.phoneOption) {
      res.push({name: ActionTriggerType.Phone});
    }
    if (this.dashboardOption) {
      res.push({name: ActionTriggerType.Dashboard});
    }
    if (this.sidebarOption) {
      res.push({name: ActionTriggerType.Sidebar});
    }
    if (this.emailOption) {
      res.push({name: ActionTriggerType.Email});
    }
    if (this.whatsappOption) {
      res.push({name: ActionTriggerType.Whatsapp});
    }
    if (this.voiceOption) {
      res.push({name: ActionTriggerType.Voice});
    }
    this.triggerForm.get('triggers').setValue(res);
  }

  private setAlertsVia(e: boolean, type: string) {
    if (type === 'email') {
      this.emailOption = e;
    }
    if (type === 'sms') {
      this.smsOption = e;
    }
    if (type === 'phone') {
      this.phoneOption = e;
    }
    if (type === 'whatsApp') {
      this.whatsappOption = e;
    }
    if (type === 'sideBar') {
      this.sidebarOption = e;
    }
    if (type === 'voice') {
      this.voiceOption = e;
    }
  }

  onChangeGeneralOption() {
    if (!this.generalOption) {
      this.emailOption = false;
      this.phoneOption = false;
      this.whatsappOption = false;
      this.sidebarOption = false;
      this.voiceOption = false;
      this.triggerForm.get('triggers').setValue([]);
    }
  }
}
