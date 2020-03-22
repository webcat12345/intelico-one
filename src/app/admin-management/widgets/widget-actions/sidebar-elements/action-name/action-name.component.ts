import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// One - Services
import { tap } from 'rxjs/operators';
import { Action } from '@one-core/model';
import { select, Store } from '@ngrx/store';
import { IType, TypeCategory, TypeList, TypesService } from '@one-core/service/types.service';
import { ActionStateService } from '../../services/action-state.service';
import { getIdentifierTypesNotVideo } from '../../../../../state/reducers';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../../../services/toastr.service';
import { orderBy, removeDuplicates } from '../../../../../core/utils/common.util';
import { SourceService } from '@one-core/service/source.service';


@Component({
  selector: 'one-admin-action-name',
  templateUrl: './action-name.component.html',
  styleUrls: ['./action-name.component.scss']
})
export class ActionNameComponent implements OnInit {

  stepInfo: any = {};
  actionNameForm: FormGroup;
  actions: any[] = [];
  triggerOption = true;
  isValidName = true;
  identifierTypes: IType[] = [];
  identifierTypes$ = this.store.pipe(select(getIdentifierTypesNotVideo), tap(x => this.identifierTypes = x));
//  sourceTypes$ = this.store.pipe(select(getSourceTypes));
  sourceTypes: TypeList;
  filteredIdentifiers: Array<{ id: any, value: string }> = [{id: null, value: null}];
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public stateService: ActionStateService,
    private toastr: ToastrService,
    private typesService: TypesService,
    private sourceService: SourceService,
    private store: Store<any>,
  ) {
  }

  ngOnInit(): void {
    if (this.stepInfo.actions) {
      this.actions = this.stepInfo.actions;
    }
    this.initActionNameForm(this.stateService.action);
    this.subscriptions.push(
      this.actionNameForm.get('name').valueChanges.subscribe(name => {
        this.isValidName = true;
        if (name) {
          this.actions.map((item) => {
            if (item.name === name) {
              this.isValidName = false;
              this.toastr.warning(`Name ${name} exists already`);
            }
          });
        }
      }));
    this.typesService.getTypes(TypeCategory.Condition).subscribe(
      res => {
        if (res.data.length) {
          this.sourceTypes = res;
        }
      }
    );
    this.sourceService.getSources().subscribe((resp) => {
      if (resp.data.length) {
        resp.data.map((item, index) => {
          this.filteredIdentifiers[index] = {id: item.identifierType.id, value: item.identifierType.value};
        });
        this.filteredIdentifiers = removeDuplicates(this.filteredIdentifiers, 'id');
        this.filteredIdentifiers = orderBy(this.filteredIdentifiers, 'value');
        this.filteredIdentifiers.unshift({id: -1, value: 'Any'});
      }
    });
    // this.toggleTriggerType(!!this.stateService.action.typeTrigger);
  }

  initActionNameForm(action?: Action): void {
    this.actionNameForm = this.formBuilder.group({
      name: [action.name || '', Validators.required],
      description: [action.description || '', Validators.required],
      type: [action.type || 'vehicle', Validators.required],
      identifierTypeId: [action.identifierTypeId || null, Validators.required],
      typeTrigger: [action.typeTrigger || '', Validators.required]
    });
  }

  save(): void {
    if (!this.triggerOption) {
      delete this.actionNameForm.value.typeTrigger;
    }
    if (this.stateService.isEditModal && this.stateService.action.conditions) {
      this.stateService.changeIdentifiersOrMetadata({id: false, metaData: true});
      this.stateService.changeStep(3);
    } else if (this.stateService.isEditModal && !this.stateService.action.conditions) {
      this.stateService.changeIdentifiersOrMetadata({id: true, metaData: false});
      this.stateService.changeStep(2);
    } else if (!this.stateService.isEditModal) {
      this.stateService.changeStep(this.stepInfo.next);
    }
   // this.actionNameForm.value.identifierType = this.identifierTypes.find(x => +x.id === +this.actionNameForm.value.identifierTypeId);
    this.stateService.saveNameForm(this.actionNameForm.value);
  }

  toggleTriggerType(e): void {
    this.triggerOption = e;
    if (this.triggerOption) {
      this.actionNameForm.get('typeTrigger').enable();
    } else {
      this.actionNameForm.get('typeTrigger').disable();
    }
  }
}
