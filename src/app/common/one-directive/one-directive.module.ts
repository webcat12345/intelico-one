import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllowedRoleDirective } from './allowed-role.directive';
import { WidgetHostDirective } from './widget-host.directive';
import { NgInitDirective } from './ng-init.directive';
import { IfFeatureActivatedDirective } from './if-feature-activated.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    AllowedRoleDirective,
    WidgetHostDirective,
    NgInitDirective,
    IfFeatureActivatedDirective
  ],
  declarations: [
    AllowedRoleDirective,
    WidgetHostDirective,
    NgInitDirective,
    IfFeatureActivatedDirective
  ]
})
export class OneDirectiveModule {
}
