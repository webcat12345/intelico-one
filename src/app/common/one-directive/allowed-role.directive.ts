import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonService } from '@one-core/service/common.service';

@Directive({
  selector: '[oneAdminAllowedRole]'
})
export class AllowedRoleDirective implements OnInit {

  @Input() oneAdminAllowedRole: Array<string> = [];

  constructor(
    private commonService: CommonService,
    private container: ViewContainerRef,
    private template: TemplateRef<any>
  ) {
  }

  ngOnInit() {
    if (this.oneAdminAllowedRole.indexOf(this.commonService.userRole) !== -1) {
      this.container.createEmbeddedView(this.template);
    }
  }

}
