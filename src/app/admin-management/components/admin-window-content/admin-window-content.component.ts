import { Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { Widget } from '../../models';
import { WindowName } from '../../meta/admin-meta';
import { WidgetHostDirective } from '../../../common/one-directive/widget-host.directive';
import { WidgetLocateComponent } from '../../widgets/widget-locate/widget-locate.component';
import { WidgetActivityComponent } from '../../widgets/widget-activity/widget-activity.component';
import { WidgetAlertsComponent } from '../../widgets/widget-alerts/widget-alerts.component';
import { WidgetActionsComponent } from '../../widgets/widget-actions/widget-actions.component';
import { WidgetViewerComponent } from '../../widgets/widget-viewer/widget-viewer.component';
import { WidgetSettingsComponent } from '../../widgets/widget-settings/widget-settings.component';
import { WidgetSuperAdminComponent } from '../../widgets/widget-super-admin/widget-super-admin.component';
import { WidgetAdminComponent } from '../../widgets/widget-admin/widget-admin.component';
import { WidgetSuperAdminGlobalStatsComponent } from '../../widgets/widget-super-admin/widget-super-admin-global-stats/widget-super-admin-global-stats.component';
import { WidgetSuperAdminOrganisationsComponent } from '../../widgets/widget-super-admin/widget-super-admin-organisations/widget-super-admin-organisations.component';
import { WidgetSuperAdminUsersComponent } from '../../widgets/widget-super-admin/widget-super-admin-users/widget-super-admin-users.component';
import { WidgetSuperAdminTypesComponent } from '../../widgets/widget-super-admin/widget-super-admin-types/widget-super-admin-types.component';
import { WidgetAdminSourceComponent } from '../../widgets/widget-admin/widget-admin-source/widget-admin-source.component';
import { WidgetAdminSiteComponent } from '../../widgets/widget-admin/widget-admin-site/widget-admin-site.component';
import { WidgetAdminCompanyComponent } from '../../widgets/widget-admin/widget-admin-company/widget-admin-company.component';
import { WidgetAdminProductComponent } from '../../widgets/widget-admin/widget-admin-product/widget-admin-product.component';
import { WidgetAdminWebhooksComponent } from '../../widgets/widget-admin/widget-admin-webhooks/widget-admin-webhooks.component';
import { WidgetAdminPeopleComponent } from '../../widgets/widget-admin/widget-admin-people/widget-admin-people.component';
import { WidgetAdminUserComponent } from '../../widgets/widget-admin/widget-admin-user/widget-admin-user.component';
import { WidgetAdminTeamComponent } from '../../widgets/widget-admin/widget-admin-team/widget-admin-team.component';
import { WidgetAdminActionComponent } from '../../widgets/widget-admin/widget-admin-action/widget-admin-action.component';
import { WidgetAdminZoneComponent } from '../../widgets/widget-admin/widget-admin-zone/widget-admin-zone.component';
import { WidgetAdminIdentifierComponent } from '../../widgets/widget-admin/widget-admin-identifier/widget-admin-identifier.component';
import { WidgetAdminAreaComponent } from '../../widgets/widget-admin/widget-admin-area/widget-admin-area.component';
import { WidgetInsightComponent } from '../../widgets/widget-insight/widget-insight.component';
import { WidgetHelpComponent } from '../../widgets/widget-help/widget-help.component';
import { WidgetAssetsComponent } from '../../widgets/widget-assets/widget-assets.component';
import { WidgetSuperAdminModulesComponent } from '../../widgets/widget-super-admin/widget-super-admin-modules/widget-super-admin-modules.component';
import { WidgetSuperAdminSystemSettingsComponent } from '../../widgets/widget-super-admin/widget-super-admin-gdpr/widget-super-admin-system-settings.component';
import { WidgetAdminResolvedReasonComponent } from '../../widgets/widget-admin/widget-admin-resolved-reason/widget-admin-resolved-reason.component';
import { WidgetSuperAdminChangeLogComponent } from '../../widgets/widget-super-admin/widget-super-admin-change-log/widget-super-admin-change-log.component';

@Component({
  selector: 'one-admin-admin-window-content',
  templateUrl: './admin-window-content.component.html',
  styleUrls: ['./admin-window-content.component.scss']
})
export class AdminWindowContentComponent implements OnInit, OnDestroy {

  @Input() box: Widget;
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(WidgetHostDirective, {static: true}) widgetHost: WidgetHostDirective;

  sb$: Subscription = new Subscription();

  isSuperAdminTypeWindow = false;
  superAdminTypeAPIUrl = '';
  superAdminTypeLabel = {label: '', mLabel: ''};

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    const typeWindows = [
      {type: 'intelicoOutputs', url: 'intelicoOutputs', label: 'intelicoOutputs', mLabel: 'intelicoOutputs'},
      {type: 'adminOutputs', url: 'adminOutputs', label: 'adminOutputs', mLabel: 'adminOutputs'},
      {type: 'intelicoZoneTypes', url: 'Zone', label: 'Zone Type', mLabel: 'Zone Types'},
      {type: 'intelicoIdentifierTypes', url: 'Identifier', label: 'Identifier Type', mLabel: 'Identifier Types'},
      {type: 'intelicoPeopleTypes', url: 'People', label: 'People Type', mLabel: 'People Types'},
      {type: 'intelicoSiteTypes', url: 'Site', label: 'Site Type', mLabel: 'Site Types'},
      {type: 'intelicoAreaTypes', url: 'Area', label: 'Area Type', mLabel: 'Area Types'},
      {type: 'intelicoAssetTypes', url: 'Assets', label: 'Asset Type', mLabel: 'Asset Types'},
      {type: 'intelicoConditionTypes', url: 'Condition', label: 'Condition Type', mLabel: 'Condition Types'},
      {type: 'intelicoInputTypes', url: 'Input', label: 'Input Type', mLabel: 'Input Types'},
      {type: 'intelicoCompanyTypes', url: 'Company', label: 'Company Type', mLabel: 'Company Types'},
      {type: 'intelicoActionReasons', url: 'Reasons', label: 'Action Reason', mLabel: 'Action Reasons'},
      {type: 'intelicoResolvedReasons', url: 'Resolved', label: 'Resolved Reason', mLabel: 'Resolved Reasons'},
      {type: 'intelicoPeopleSource', url: 'peopleSources', label: 'People Source', mLabel: 'People Sources'},
      {type: 'intelicoActionTrigger', url: 'actionTriggers', label: 'Action Trigger', mLabel: 'Action Triggers'},
      {type: 'intelicoInputAgents', url: 'agents', label: 'Input Agent', mLabel: 'Input Agents'},
      {type: 'intelicoIdentifierSource', url: 'identifierSources', label: 'Source Types', mLabel: 'Source Types'},
    ];
    const index = typeWindows.findIndex(x => x.type === this.box.type);
    this.isSuperAdminTypeWindow = index > -1;
    this.superAdminTypeAPIUrl = index > -1 ? typeWindows[index].url : '';
    this.superAdminTypeLabel = index > -1 ? {label: typeWindows[index].label, mLabel: typeWindows[index].mLabel} : {label: '', mLabel: ''};
    this.loadComponent(this.componentClassResolver(this.box.type as WindowName));
  }

  ngOnDestroy(): void {
    this.sb$.unsubscribe();
  }

  loadComponent(component): void {
    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const viewContainerRef = this.widgetHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      if (component === WidgetSuperAdminTypesComponent) {
        const componentInstance = componentRef.instance as WidgetSuperAdminTypesComponent;
        componentInstance.label = this.superAdminTypeLabel;
        componentInstance.apiUrl = this.superAdminTypeAPIUrl;
      } else if (component === WidgetAdminWebhooksComponent) {
        const componentInstance = componentRef.instance as WidgetAdminWebhooksComponent;
        componentInstance.data = this.box.type;
      } else if (
        component === WidgetAdminCompanyComponent || component === WidgetAdminPeopleComponent || component === WidgetAdminUserComponent || component === WidgetAdminCompanyComponent
        || component === WidgetAdminActionComponent || component === WidgetAdminZoneComponent || component === WidgetAdminIdentifierComponent
        || component === WidgetAdminAreaComponent) {
        const componentInstance = componentRef.instance as any;
        componentInstance.isAddWindow = this.box.isAdd;
        this.sb$ = componentInstance.close.subscribe(res => {
          this.close.emit(res);
        });
      } else if (component === WidgetSettingsComponent) {
        if (this.box.data) {
          const componentInstance = componentRef.instance as any;
          componentInstance.data = this.box.data;
        }
      } else if (component === WidgetSuperAdminSystemSettingsComponent) {
        if (this.box.data) {
          const componentInstance = componentRef.instance as any;
          componentInstance.data = this.box.data;
        }
      }
    } else {
      return;
    }
  }

  componentClassResolver(windowName: WindowName) {
    switch (windowName) {
      case WindowName.Insight:
        return WidgetInsightComponent;
      case WindowName.Locate:
        return WidgetLocateComponent;
      case WindowName.Activity:
        return WidgetActivityComponent;
      case WindowName.Alert:
        return WidgetAlertsComponent;
      case WindowName.Control:
        return WidgetActionsComponent;
      case WindowName.Assets:
        return WidgetAssetsComponent;
      case WindowName.Help:
        return WidgetHelpComponent;
      case WindowName.View:
        return WidgetViewerComponent;
      case WindowName.Settings:
        return WidgetSettingsComponent;
      case WindowName.SuperAdmin:
        return WidgetSuperAdminComponent;
      case WindowName.SuperAdminSystemSettings:
        return WidgetSuperAdminSystemSettingsComponent;
      case WindowName.Admin:
        return WidgetAdminComponent;
      case WindowName.SuperAdminOrganisation:
        return WidgetSuperAdminOrganisationsComponent;
      case WindowName.SuperAdminOutput:
        return WidgetAdminWebhooksComponent;
      case WindowName.SuperAdminGlobalStats:
        return WidgetSuperAdminGlobalStatsComponent;
      case WindowName.SuperAdminModules:
        return WidgetSuperAdminModulesComponent;
      case WindowName.SuperAdminChangelog:
        return WidgetSuperAdminChangeLogComponent;
      case WindowName.SuperAdminUser:
        return WidgetSuperAdminUsersComponent;
      case WindowName.AdminSource:
        return WidgetAdminSourceComponent;
      case WindowName.AdminSite:
        return WidgetAdminSiteComponent;
      case WindowName.AdminOutput:
        return WidgetAdminWebhooksComponent;
      case WindowName.People:
        return WidgetAdminPeopleComponent;
      case WindowName.Team:
        return WidgetAdminTeamComponent;
      case WindowName.AdminGroups:
        return WidgetAdminCompanyComponent;
      case WindowName.AdminProduct:
        return WidgetAdminProductComponent;
      case WindowName.AdminUser:
        return WidgetAdminUserComponent;
      case WindowName.AdminZone:
        return WidgetAdminZoneComponent;
      case WindowName.AdminArea:
        return WidgetAdminAreaComponent;
      case WindowName.AdminResolvedReason:
        return WidgetAdminResolvedReasonComponent;
      default:
        break;
    }

    if (this.isSuperAdminTypeWindow) {
      return WidgetSuperAdminTypesComponent;
    }
  }
}
