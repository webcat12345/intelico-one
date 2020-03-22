import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IType, TypesService } from '@one-core/service/types.service';
import { IPeople } from '@one-core/service/people.service';

@Component({
  selector: 'one-admin-widget-admin-people-tab-additional',
  templateUrl: './widget-admin-people-tab-additional.component.html',
  styleUrls: ['./widget-admin-people-tab-additional.component.scss']
})
export class WidgetAdminPeopleTabAdditionalComponent implements OnInit {

  @Input() people: IPeople;

  genderTypes$: Observable<IType[]> = new Observable<IType[]>();
  hairTypes$: Observable<IType[]> = new Observable<IType[]>();
  eyeTypes$: Observable<IType[]> = new Observable<IType[]>();
  buildTypes$: Observable<IType[]> = new Observable<IType[]>();
  ethnicityTypes$: Observable<IType[]> = new Observable<IType[]>();

  isGenderTypesLoading = true;
  isHairTypesLoading = true;
  isBuildTypesLoading = true;
  isEyeTypesLoading = true;
  isEthnicityTypesLoading = true;

  constructor(
    private typeService: TypesService
  ) {
  }

  ngOnInit() {
    this.genderTypes$ = this.typeService.lookupTypes('Gender')
      .pipe(
        map((x: IType[]) => x),
        tap(() => this.isGenderTypesLoading = false)
      );
    this.eyeTypes$ = this.typeService.lookupTypes('EyeColor')
      .pipe(
        map((x: IType[]) => x),
        tap(() => this.isEyeTypesLoading = false)
      );
    this.hairTypes$ = this.typeService.lookupTypes('HairColor')
      .pipe(
        map((x: IType[]) => x),
        tap(() => this.isHairTypesLoading = false)
      );
    this.buildTypes$ = this.typeService.lookupTypes('Build')
      .pipe(
        map((x: IType[]) => x),
        tap(() => this.isBuildTypesLoading = false)
      );
    this.ethnicityTypes$ = this.typeService.lookupTypes('Ethnicity')
      .pipe(
        map((x: IType[]) => x),
        tap(() => this.isEthnicityTypesLoading = false)
      );
  }

  byId(item1, item2) {
    if (item1 && item2) {
      return item1.id === item2.id;
    } else {
      return false;
    }
  }
}
