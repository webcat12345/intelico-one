import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// One - Services
import { ActionDate } from '@one-core/model';
import { ActionStateService } from '../../services/action-state.service';
import { WeekdaySelectorComponent } from '@one-common/ui-kit/weekday-selector/weekday-selector.component';

@Component({
  selector: 'one-admin-action-rule-form',
  templateUrl: './action-rule-form.component.html',
  styleUrls: ['./action-rule-form.component.scss']
})
export class ActionRuleFormComponent implements OnInit {

  @ViewChild(WeekdaySelectorComponent, {static: true}) wdSelector: WeekdaySelectorComponent;

  stepInfo: any = {};
  specificTime = false;
  specificDate = false;

  dateRuleForm: FormGroup;

  constructor(
    public actionStateService: ActionStateService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initDateRuleForm({});
  }

  initDateRuleForm(rule: ActionDate): void {
    this.dateRuleForm = this.formBuilder.group({
      from: [rule.from || '00:00:00', Validators.required],
      to: [rule.to || '23:59:59', Validators.required],
      days: [rule.days || ['All'], Validators.required]
    });
  }

  save(): void {
    this.actionStateService.addDateRule(this.dateRuleForm.value);
    this.actionStateService.changeStep(this.stepInfo.next);
  }

  toggleTimeMode(e): void {
    this.specificTime = e;
    if (!this.specificTime) {
      this.dateRuleForm.get('from').setValue('00:00:00');
      this.dateRuleForm.get('to').setValue('23:59:59');
    }
  }

  toggleDateMode(e): void {
    this.specificDate = e;
    if (!this.specificDate) {
      this.dateRuleForm.get('days').setValue(['All']);
    } else {
      this.dateRuleForm.get('days').setValue([]);
    }
    this.wdSelector.toggleAll(!this.specificDate);
  }

}
