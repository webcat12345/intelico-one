import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '@one-core/service/feature-flag.service';

@Directive({
  selector: '[oneAdminIfFeatureActivated]'
})
export class IfFeatureActivatedDirective {

  @Input() set oneAdminIfFeatureActivated(feature: string) {
    this.viewContainer.clear();
    const activated = this.featureService.isFeatureNameActivated(feature);
    if (activated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureService: FeatureFlagService
  ) { }

}
