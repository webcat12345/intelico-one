import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[oneAdminWidgetHost]'
})
export class WidgetHostDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) {
  }

}
