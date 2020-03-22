import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// One - Services
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService } from '@one-core/service/company.service';
import { CreateRemoveGroups, IPeople, PeopleService } from '@one-core/service/people.service';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminPeopleStateService } from '../../services/widget-admin-people-state.service';
import { ToastrService } from '../../../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-people-groups-detail',
  templateUrl: './widget-admin-people-groups-detail.component.html',
  styleUrls: ['./widget-admin-people-groups-detail.component.scss']
})
export class WidgetAdminPeopleGroupsDetailComponent implements OnInit {

  @Input() person: IPeople;
  @Input() isNew: boolean;
  @Output() nextStep: EventEmitter<string> = new EventEmitter();
  @Output() closeAddModal: EventEmitter<boolean> = new EventEmitter();

  groupNames: Array<any> = [];
  addDuplicateGroupNames: Array<any> = [];
  deleteDuplicateGroupNames: Array<any> = [];
  updateGroupIds: Array<string> = [];
  selectedGroupName = '';
  editGroups: CreateRemoveGroups = {removeGroups: [], newGroups: []};
  selectedGroupNameId: string;
  showConfirmModal: boolean;

  info: Array<TableInfo> = [
    {label: '', name: 'groupName', width: '', isLink: false},
    {label: '', name: 'action_group', width: '70px', isLink: false},
  ];

  data: Array<any> = [];
  selectGroupName: FormGroup = this.fb.group({
    group_name: ['']
  });


  constructor(
    public widgetAdminPeopleStateService: WidgetAdminPeopleStateService,
    private companyService: CompanyService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.selectGroupName.controls.group_name.setValue('default');
    this.companyService.getCompanies('')
      .subscribe(
        companies => {
          if (companies.data.length > 0) {
            companies.data.map((item, index) => {
              this.groupNames.push({id: item.id, value: item.name});
              this.addDuplicateGroupNames.push({id: item.id, value: item.name});
              this.deleteDuplicateGroupNames.push({id: item.id, value: item.name});
            });
          }
          if (this.isNew) {
            if (this.person.peopleGroupAssociates.length > 0) {
              this.groupNames.map((item, index) => {
                this.person.peopleGroupAssociates.map((itm) => {
                  if (item.id === itm.groupId) {
                    this.addDuplicateGroupNames.splice(index, 1);
                    this.addDuplicateGroupNames.splice(index, 0, {id: 1, value: ''});
                    this.data.push({id: item.id, groupName: item.value});
                  }
                });
              });
            }
            this.groupNames = this.addDuplicateGroupNames;
          }
          if (!this.isNew) {
            if (this.person.groups.newGroups.length > 0) {
              this.groupNames.map((item) => {
                this.person.groups.newGroups.map((itm, index) => {
                  if (item.id === itm) {
                    this.data.push({id: item.id, groupName: item.value});
                    this.groupNames.splice(index, 1);
                    this.groupNames.splice(index, 0, {id: 1, value: ''});
                  }
                });
              });
            }
          }
        }
      );
    this.selectGroupName.get('group_name').valueChanges.subscribe(groupName => {
      if (groupName) {
        this.selectedGroupName = groupName;
      }
    });

  }

  onRemove(e): void {
    this.selectedGroupNameId = e.id;
    this.showConfirmModal = true;
  }

  onDelete(e): void {
    if (e) {
      this.data.map((item, index) => {
        if (this.selectedGroupNameId === item.id) {
          this.data.splice(index, 1);
        }
      });
      if (!this.isNew) {
        this.person.groups.newGroups.map((item, index) => {
          if (this.selectedGroupNameId === item) {
            this.person.groups.newGroups.splice(index, 1);
          }
        });
      }
      this.deleteDuplicateGroupNames.map((item, index) => {
        if (this.selectedGroupNameId === item.id) {
          this.addDuplicateGroupNames.splice(index, 1);
          this.groupNames.splice(index, 0, item);
          this.editGroups.removeGroups.push(item.id);
        }
      });
      this.showConfirmModal = false;
      this.selectedGroupName = '';
    } else {
      this.showConfirmModal = false;
    }
  }

  addGroupName(): void {
    this.groupNames.map((item, index) => {
      if (item.value === this.selectedGroupName) {
        if (!this.isNew) {
          this.person.groups.newGroups.push(item.id);
        }
        if (this.isNew) {
          this.editGroups.newGroups.push(item.id);
        }
        this.data.push({id: item.id, groupName: this.selectedGroupName});
        this.updateGroupIds.push(item.id);
        this.addDuplicateGroupNames.splice(index, 1);
        this.addDuplicateGroupNames.splice(index, 0, {id: 1, value: ''});
        this.groupNames = [];
        this.groupNames = this.addDuplicateGroupNames;
      }
    });
    this.selectedGroupName = '';
    this.selectGroupName.controls.group_name.setValue('default');
    this.widgetAdminPeopleStateService.updatePerson(this.person);
    if (this.isNew) {
      this.peopleService.setEditGroups(this.editGroups);
    }
    //  this.selectGroupName.reset();
  }

  nextStepPerson(): void {
    this.peopleService.setEditGroups(this.editGroups);
    this.widgetAdminPeopleStateService.updateCountSteps(4);
    this.nextStep.emit('products');
  }

  async updateGroups(): Promise<void> {
    if (this.person.id) {
      await this.peopleService.createEditPeopleGroups(this.person.id, this.peopleService.editGroups).toPromise();
      this.toastr.success('Successfully updated a group(s)');
      this.closeAddModal.emit(true);
    }
    this.closeAddModal.emit(true);
  }
}
