import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
// One - Services
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from '../../../admin-management/services/toastr.service';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-resolved-reason-filter',
  templateUrl: './resolved-reason-filter.component.html',
  styleUrls: ['./resolved-reason-filter.component.scss']
})
export class ResolvedReasonFilterComponent implements OnInit, OnChanges {

  @Input() keyword: string;
  @Input() isAny: boolean;
  @Input() isDisabled: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter();
  resolvedReasonList: IType[];

  filter: FormGroup = this.fb.group({
    type: ['-1']
  });

  constructor(private typesService: TypesService,
              private fb: FormBuilder,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.filter.get('type').valueChanges.subscribe(res => {
      if (+res > 0) {
        this.changeFilter.emit(`${this.keyword} eq ${res}`);
      } else {
        this.changeFilter.emit(null);
      }
    });
    this.getTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDisabled) {
      this.filter.get('type').disable();
    } else {
      this.filter.get('type').enable();
    }
  }

  async getTypes() {
    try {
      this.typesService.getTypes(TypeCategory.Resolved)
        .subscribe(
          resp => {
            this.resolvedReasonList = resp.data;
          }
        );
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
    }
  }

  setDefaultReason() {
    this.filter.get('type').setValue('-1');
  }

}
