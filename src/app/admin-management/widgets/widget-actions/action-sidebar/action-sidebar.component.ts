import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActionStateService, ActionStep, IdentifiersOrMetadata } from '../services/action-state.service';
import { WidgetHostDirective } from '../../../../common/one-directive/widget-host.directive';
import { ActionSplashComponent } from '../sidebar-elements/action-splash/action-splash.component';
import { ActionNameComponent } from '../sidebar-elements/action-name/action-name.component';
import { ActionTriggerComponent } from '../sidebar-elements/action-trigger/action-trigger.component';
import { ActionRuleComponent } from '../sidebar-elements/action-rule/action-rule.component';
import { ActionLocationComponent } from '../sidebar-elements/action-location/action-location.component';
import { ActionAlertSettingComponent } from '../sidebar-elements/action-alert-setting/action-alert-setting.component';
import { ActionRuleFormComponent } from '../sidebar-elements/action-rule-form/action-rule-form.component';
import { ActionLocationFormComponent } from '../sidebar-elements/action-location-form/action-location-form.component';
import { ActionIdentifierComponent } from '../sidebar-elements/action-identifier/action-identifier.component';
import { ActionRecipientsComponent } from '../sidebar-elements/action-recipients/action-recipients.component';
import { ActionMetaDataComponent } from '../sidebar-elements/action-meta-data/action-meta-data.component';
import { ActionOutputComponent } from '../sidebar-elements/action-output/action-output.component';
import { FeatureFlagService } from '@one-core/service/feature-flag.service';

interface StepInfo {
  title?: string;
  stepNumber?: number;
  next?: ActionStep;
  previous?: ActionStep;
  isForm?: boolean;
  buttonLabel?: string;
}

@Component({
  selector: 'one-admin-action-sidebar',
  templateUrl: './action-sidebar.component.html',
  styleUrls: ['./action-sidebar.component.scss']
})
export class ActionSidebarComponent implements OnInit, OnDestroy {
  @Input() actions: any[] = [];

  @ViewChild(WidgetHostDirective, {static: true}) widgetHost: WidgetHostDirective;

  step: ActionStep = ActionStep.Splash;

  selectedAction: any = {};
  identifiersOrMetadata: IdentifiersOrMetadata;

  stepChange$: Subscription = new Subscription();
  identifiersOrMetadata$: Subscription = new Subscription();

  allStepsNumber = 7;
  stepNumberMetaData: number;
  stepNumberTime: number;
  stepNumberLocation: number;
  stepNumberSetting: number;
  stepNumberOutput: number;
  stepNumberRecipients: number;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private actionStateService: ActionStateService,
    private featureSerivce: FeatureFlagService
  ) {
  }

  get stepInfo(): StepInfo {
    let info = null;
    switch (this.step) {
      case ActionStep.Splash:
        info = {title: '', allStepsNumber: this.allStepsNumber, stepNumber: 0, next: ActionStep.ActionName, previous: ActionStep.Splash, buttonLabel: ''};
        break;
      case ActionStep.ActionName:
        info = {title: 'Add New Action', allStepsNumber: this.allStepsNumber, stepNumber: 1, next: ActionStep.ActionIdentifier, previous: ActionStep.Splash, buttonLabel: 'Next', actions: this.actions};
        break;
      case ActionStep.ActionIdentifier:
        info = {
          title: 'Main Action Triggers', allStepsNumber: this.allStepsNumber,
          stepNumber: 2,
          next: this.identifiersOrMetadata.id ? ActionStep.ActionTime : ActionStep.ActionMetaData,
          previous: ActionStep.ActionName, buttonLabel: 'Next'
        };
        break;
      case ActionStep.ActionMetaData:
        info = {title: 'Main Action MetaData', allStepsNumber: this.allStepsNumber, stepNumber: this.stepNumberMetaData, next: ActionStep.ActionTime, previous: ActionStep.ActionIdentifier, buttonLabel: 'Next'};
        break;
      case ActionStep.ActionTime:
        info = {
          title: 'Rule Time & Date', allStepsNumber: this.allStepsNumber,
          stepNumber: this.stepNumberTime,
          next: ActionStep.ActionLocation,
          previous: this.identifiersOrMetadata.id ? ActionStep.ActionIdentifier : ActionStep.ActionMetaData,
          buttonLabel: 'Next'
        };
        break;
      case ActionStep.ActionTimeForm:
        info = {title: '', stepNumber: 0, next: ActionStep.ActionTime, previous: ActionStep.ActionTime, isForm: true, buttonLabel: 'Save'};
        break;
      case ActionStep.ActionLocation:
        info = {title: 'What Location', allStepsNumber: this.allStepsNumber, stepNumber: this.stepNumberLocation, next: ActionStep.ActionAlertSetting, previous: ActionStep.ActionTime, buttonLabel: 'Next'};
        break;
      case ActionStep.ActionLocationForm:
        info = {title: '', stepNumber: 0, next: ActionStep.ActionLocation, previous: ActionStep.ActionLocation, isForm: true, buttonLabel: 'Save'};
        break;
      case ActionStep.ActionAlertSetting:
        info = {title: 'Triggered Action', allStepsNumber: this.allStepsNumber, stepNumber: this.stepNumberSetting, next: ActionStep.ActionOutput, previous: ActionStep.ActionLocation, buttonLabel: 'Next'};
        if (!this.featureSerivce.isFeatureNameActivated('Outputs')) {
          info.next = ActionStep.ActionRecipients;
        }
        break;
      case ActionStep.ActionOutput:
        info = {title: 'Output Options', allStepsNumber: this.allStepsNumber, stepNumber: this.stepNumberOutput, next: ActionStep.ActionRecipients, previous: ActionStep.ActionAlertSetting, buttonLabel: 'Next'};
        break;
      case ActionStep.ActionRecipients:
        info = {title: 'Recipients', allStepsNumber: this.allStepsNumber, stepNumber: this.stepNumberRecipients, next: ActionStep.Splash, previous: ActionStep.ActionOutput, buttonLabel: 'Finish'};
        if (!this.featureSerivce.isFeatureNameActivated('Outputs')) {
          info.previous = ActionStep.ActionAlertSetting;
        }
        break;
      case ActionStep.IdentifierForm:
        info = {title: this.selectedAction.name, stepNumber: 0, next: null, previous: null, buttonLabel: 'Save'};
        break;
      default:
        info = null;
        break;
    }
    return info;
  }

  ngOnInit() {
    this.identifiersOrMetadata$ = this.actionStateService.identifiersOrMetadata$.subscribe(identifiersOrMetadata => {
      this.identifiersOrMetadata = identifiersOrMetadata;
      if (this.identifiersOrMetadata.id) {
        this.stepNumberMetaData = -1;
        this.stepNumberTime = 3;
        this.stepNumberLocation = 4;
        this.stepNumberSetting = 5;
        this.stepNumberOutput = 6;
        this.stepNumberRecipients = 7;
        this.allStepsNumber = 7;
        this.checkOutputFeatureFlag(6, 6);
      } else if (this.identifiersOrMetadata.metaData && this.actionStateService.isEditModal) {
        this.stepNumberMetaData = 2;
        this.stepNumberTime = 3;
        this.stepNumberLocation = 4;
        this.stepNumberSetting = 5;
        this.stepNumberOutput = 6;
        this.stepNumberRecipients = 7;
        this.allStepsNumber = 7;
        this.checkOutputFeatureFlag(6, 6);
      } else if (this.identifiersOrMetadata.metaData) {
        this.stepNumberMetaData = 3;
        this.stepNumberTime = 4;
        this.stepNumberLocation = 5;
        this.stepNumberSetting = 6;
        this.stepNumberOutput = 7;
        this.stepNumberRecipients = 8;
        this.allStepsNumber = 8;
        this.checkOutputFeatureFlag(7, 7);
      }
    });
    this.stepChange$ = this.actionStateService.changeStep$.subscribe(step => {
      this.changeStep(step);
    });
    this.changeStep(ActionStep.Splash);
  }

  ngOnDestroy() {
    this.stepChange$.unsubscribe();
    this.identifiersOrMetadata$.unsubscribe();
  }

  changeStep(step: ActionStep) {
    this.step = step;
    let component = null;
    switch (step) {
      case ActionStep.Splash:
        component = ActionSplashComponent;
        break;
      case ActionStep.ActionName:
        component = ActionNameComponent;
        break;
      case ActionStep.ActionIdentifier:
        component = ActionTriggerComponent;
        break;
      case ActionStep.ActionMetaData:
        component = ActionMetaDataComponent;
        break;
      case ActionStep.ActionTime:
        component = ActionRuleComponent;
        break;
      case ActionStep.ActionTimeForm:
        component = ActionRuleFormComponent;
        break;
      case ActionStep.ActionLocation:
        component = ActionLocationComponent;
        break;
      case ActionStep.ActionLocationForm:
        component = ActionLocationFormComponent;
        break;
      case ActionStep.ActionAlertSetting:
        component = ActionAlertSettingComponent;
        break;
      case ActionStep.ActionOutput:
        component = ActionOutputComponent;
        break;
      case ActionStep.ActionRecipients:
        component = ActionRecipientsComponent;
        break;
      case ActionStep.IdentifierForm:
        component = ActionIdentifierComponent;
        break;
      default:
        component = ActionAlertSettingComponent;
        break;
    }
    this.loadComponent(component);
  }

  loadComponent(component) {
    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const viewContainerRef = this.widgetHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);

      const allIns: any = componentRef.instance;
      allIns.stepInfo = this.stepInfo;
      if (component === ActionSplashComponent) {
        const componentInstance = componentRef.instance as ActionSplashComponent;
        componentInstance.select.subscribe(res => {
          this.changeStep(ActionStep.ActionName);
        });
      } else if (component === ActionRuleComponent) {
        const componentInstance = componentRef.instance as ActionRuleComponent;
        componentInstance.add.subscribe(res => {
          this.changeStep(ActionStep.ActionTimeForm);
        });
      } else if (component === ActionLocationComponent) {
        const componentInstance = componentRef.instance as ActionLocationComponent;
        componentInstance.add.subscribe(res => {
          this.changeStep(ActionStep.ActionLocationForm);
        });
      }

    } else {
      return;
    }
  }

  private checkOutputFeatureFlag(recipients, all) {
    if (!this.featureSerivce.isFeatureNameActivated('Outputs')) {
      this.stepNumberRecipients = recipients;
      this.allStepsNumber = all;
    }
  }

}
