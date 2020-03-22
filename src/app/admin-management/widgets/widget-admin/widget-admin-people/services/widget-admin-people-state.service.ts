import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPeople } from '@one-core/service/people.service';

@Injectable()
export class WidgetAdminPeopleStateService {

  public person$: BehaviorSubject<IPeople> = new BehaviorSubject(null);
  public countSteps$: BehaviorSubject<number> = new BehaviorSubject(null);
  public reloadGetPeople$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  isUpdateIdentifiers: boolean;
  isUpdateGroups: boolean;
  isUpdateProducts: boolean;

  public updatePerson(person: IPeople) {
    this.person$.next(person);
  }

  public updateReloadGetPeople(value: boolean) {
    this.reloadGetPeople$.next(value);
  }

  public updateCountSteps(count: number) {
    this.countSteps$.next(count);
  }

  setUpdateIdentifiers(e: boolean): void {
    this.isUpdateIdentifiers = e;
  }

  setUpdateGroups(e: boolean): void {
    this.isUpdateGroups = e;
  }

  setUpdateProducts(e: boolean): void {
    this.isUpdateProducts = e;
  }
}
