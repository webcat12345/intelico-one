import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IIdentifier } from '@one-core/service/identifier.service';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-widget-admin-identifier-content-details-tab',
  templateUrl: './widget-admin-identifier-content-details-tab.component.html',
  styleUrls: ['./widget-admin-identifier-content-details-tab.component.scss']
})
export class WidgetAdminIdentifierContentDetailsTabComponent implements OnInit {

  @Input() identifier: IIdentifier;

  idSource$: Observable<IType[]>;
  isIdSourceLoading = true;

  constructor(
    private typeService: TypesService
  ) {
  }

  ngOnInit() {
    this.idSource$ = this.typeService.getTypes(TypeCategory.IdentifierSources)
      .pipe(
        map((x: any) => x.data),
        tap(() => this.isIdSourceLoading = false)
      );
  }

}
