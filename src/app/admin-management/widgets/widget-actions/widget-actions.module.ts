import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgPipesModule } from 'ngx-pipes';
import { NgSelectModule } from '@ng-select/ng-select';

import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { OnePipeModule } from '@one-common/pipe';
import { TimePickerModule } from '@one-common/ui-kit/time-picker/time-picker.module';
import { LayerSelectorModule } from '@one-common/ui-kit/layer-selector/layer-selector.module';
import { UiSwitchModule } from '@one-common/ui-kit/ui-switch/ui-switch.module';
import { WeekdaySelectorModule } from '@one-common/ui-kit/weekday-selector/weekday-selector.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OneDirectiveModule } from '@one-common/directive';
import { ExpansionTableModule } from '@one-common/ui-kit/expansion-table/expansion-table.module';

import { ActionStateService } from './services/action-state.service';

import { WidgetActionsComponent } from './widget-actions.component';
import { ActionTableComponent } from './action-table/action-table.component';
import { ActionSidebarComponent } from './action-sidebar/action-sidebar.component';
import { ActionSplashComponent } from './sidebar-elements/action-splash/action-splash.component';
import { ActionNameComponent } from './sidebar-elements/action-name/action-name.component';
import { ActionTriggerComponent } from './sidebar-elements/action-trigger/action-trigger.component';
import { ActionRuleComponent } from './sidebar-elements/action-rule/action-rule.component';
import { ActionLocationComponent } from './sidebar-elements/action-location/action-location.component';
import { ActionAlertSettingComponent } from './sidebar-elements/action-alert-setting/action-alert-setting.component';
import { ActionOutputComponent } from './sidebar-elements/action-output/action-output.component';
import { ActionRuleFormComponent } from './sidebar-elements/action-rule-form/action-rule-form.component';
import { ActionLocationFormComponent } from './sidebar-elements/action-location-form/action-location-form.component';
import { ActionFilterComponent } from './action-filter/action-filter.component';
import { ActionIdentifierComponent } from './sidebar-elements/action-identifier/action-identifier.component';
import { ActionRecipientsComponent } from './sidebar-elements/action-recipients/action-recipients.component';
import { ActionMetaDataComponent } from './sidebar-elements/action-meta-data/action-meta-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    OneWindowModule,
    LayerSelectorModule,
    UiSwitchModule,
    WeekdaySelectorModule,
    LoaderModule,
    OneFilterModule,
    NgSelectModule,
    NgPipesModule,
    ExpansionTableModule,
    OneDirectiveModule,
    TimePickerModule,
    OnePipeModule,
  ],
  declarations: [
    WidgetActionsComponent,
    ActionTableComponent,
    ActionSidebarComponent,
    ActionSplashComponent,
    ActionNameComponent,
    ActionTriggerComponent,
    ActionRuleComponent,
    ActionMetaDataComponent,
    ActionLocationComponent,
    ActionAlertSettingComponent,
    ActionOutputComponent,
    ActionRuleFormComponent,
    ActionLocationFormComponent,
    ActionFilterComponent,
    ActionIdentifierComponent,
    ActionRecipientsComponent
  ],
  exports: [
    WidgetActionsComponent
  ],
  entryComponents: [
    WidgetActionsComponent,
    ActionSplashComponent,
    ActionNameComponent,
    ActionTriggerComponent,
    ActionRuleComponent,
    ActionMetaDataComponent,
    ActionLocationComponent,
    ActionAlertSettingComponent,
    ActionOutputComponent,
    ActionRuleFormComponent,
    ActionLocationFormComponent,
    ActionIdentifierComponent,
    ActionRecipientsComponent
  ],
  providers: [
    ActionStateService,
    DatePipe
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class WidgetActionsModule {
}
