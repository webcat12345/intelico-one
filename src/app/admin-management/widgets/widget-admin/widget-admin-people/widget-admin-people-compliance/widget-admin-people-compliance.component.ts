import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { CommonService } from '@one-core/service/common.service';
import { ToastrService } from '../../../../services/toastr.service';
import { IOrganisation } from '@one-core/service/organisation.service';
import { IPeople, PeopleService } from '@one-core/service/people.service';
import { WidgetAdminPeopleStateService } from '../services/widget-admin-people-state.service';

@Component({
  selector: 'one-admin-widget-admin-people-compliance',
  templateUrl: './widget-admin-people-compliance.component.html',
  styleUrls: ['./widget-admin-people-compliance.component.scss']
})
export class WidgetAdminPeopleComplianceComponent implements OnInit, OnDestroy {

  @Input() person: IPeople;
  @Input() isNew: boolean;
  @Output() closeAddModal: EventEmitter<boolean> = new EventEmitter();
  subscriptionPerson: Subscription;
  selectedOrg: IOrganisation;

  constructor(
    private widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
    private peopleService: PeopleService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.selectedOrg = this.commonService.organisation;
    this.subscriptionPerson = this.widgetAdminPeopleStateService.person$.subscribe(
      person => {
        if (person) {
          this.person = person;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionPerson.unsubscribe();
  }

  async compliance(): Promise<void> {
    try {
      // this.isLoading = true;
      delete this.person.metadata.address.addressPeople;
      if (!this.isNew) {
        const res = await this.peopleService.createPeople(this.person).toPromise() as IPeople;
        if (res) {
          this.peopleService.createPeopleIdentifiers(res.id, this.person.identifiers).toPromise()
            .then(
              resp => {
                this.peopleService.createEditPeopleGroups(res.id, this.person.groups).toPromise()
                  .then(
                    response => {
                      this.toastr.success('Successfully created a new person');
                      this.closeAddModal.emit(true);
                      this.widgetAdminPeopleStateService.updateReloadGetPeople(true);
                    }, err => console.error(err)
                  );
              }, err => console.error(err)
            );
        }

        // this.close.emit({isNew: true, res: res});
      } else {
        const res = await this.peopleService.editPeople(this.person).toPromise();
        if (res.id) {
          this.peopleService.createPeopleIdentifiers(res.id, this.peopleService.dataIdentifiers).toPromise()
            .then(
              resp => {
                this.peopleService.createEditPeopleGroups(res.id, this.peopleService.editGroups).toPromise()
                  .then(
                    response => {
                      this.toastr.success('Successfully updated a person');
                      this.closeAddModal.emit(true);
                      this.widgetAdminPeopleStateService.updateReloadGetPeople(true);
                    }, err => console.error(err)
                  );
              }, err => console.error(err)
            );
        }
        // const res = await this.peopleService.addPeopleToCompanies(this.people.id, this.companyList.map(x => x.id));
        //  this.close.emit({isNew: false, res: this.person});
        this.closeAddModal.emit(true);
        //   this.toastr.success('Successfully updated a new person');
      }
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      //  this.isLoading = false;
    }
  }

}
