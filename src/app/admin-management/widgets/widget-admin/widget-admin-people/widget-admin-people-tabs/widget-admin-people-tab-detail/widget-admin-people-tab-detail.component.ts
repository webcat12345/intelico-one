import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { DatePipe } from '@angular/common';
import { GenderType, IPeople } from '@one-core/service/people.service';
import { WidgetAdminPeopleStateService } from '../../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-tab-detail',
  templateUrl: './widget-admin-people-tab-detail.component.html',
  styleUrls: ['./widget-admin-people-tab-detail.component.scss']
})
export class WidgetAdminPeopleTabDetailComponent implements OnInit {

  @Input() people: IPeople;
  @Input() isNew: boolean;
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() addressLookup: EventEmitter<any> = new EventEmitter();

  animationDone = false;
  fromDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  genderType: Array<GenderType> = [{id: 150, name: 'Male'}, {id: 151, name: 'Female'}];
  minDate = new Date(1900, 1, 1);

  constructor(
    private widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    if (this.people.metadata.address && this.isNew) {
      // tslint:disable-next-line
      this.people.metadata.address.addressPeople = `${this.people.metadata.address.line1}, ${this.people.metadata.address.line2}, ${this.people.metadata.address.town}, ${this.people.metadata.address.county}, ${this.people.metadata.address.country}, ${this.people.metadata.address.postCode}`;
    }
    this.startAnimation();
    if (!this.isNew) {
      this.people.metadata.birthday = null;
    }
    if (this.people.metadata.birthday) {
      this.people.metadata.birthday = new Date(this.people.metadata.birthday);
    }
  }

  nextStepPerson() {
    this.widgetAdminPeopleStateService.updateCountSteps(2);
    this.nextStep.emit('identifier');
    if (this.people.metadata.birthday) {
      const time: any = this.people.metadata.birthday.getTime();
      const date: any = this.datePipe.transform(time, 'yyyy-MM-dd');
      this.people.metadata.birthday = date;
    }
    this.widgetAdminPeopleStateService.updatePerson(this.people);
  }

  onAddressChanged(e): void {
    this.addressLookup.emit(e);
    this.people.metadata.address = {
      country: 'United Kingdom',
      postCode: e.data.postcode,
      town: e.data.post_town,
      //  city: e.data.ward,
      county: e.data.county,
      line1: e.data.line_1 || e.data.district,
      line2: e.data.line_2,
      latitude: e.data.latitude,
      longitude: e.data.longitude
    };
    this.people.metadata.address.addressPeople = e.address;
  }

  private startAnimation() {
    this.animationDone = false;
    setTimeout(() => {
      this.animationDone = true;
    }, 400);
  }
}
