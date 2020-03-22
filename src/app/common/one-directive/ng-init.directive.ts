import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[ngInit]',
  exportAs: 'ngInit'
})

export class NgInitDirective {
  @Input() ngInit;
}
