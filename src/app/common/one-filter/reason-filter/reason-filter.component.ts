import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from '../../../admin-management/services/toastr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-reason-filter',
  templateUrl: './reason-filter.component.html',
  styleUrls: ['./reason-filter.component.scss']
})
export class ReasonFilterComponent implements OnInit, OnDestroy, OnChanges {

  @Input() keyword: string;
  @Input() isAny: boolean;
  @Input() isFilteredReasons: boolean;
  @Input() filteredReasons: Array<{ id: number, value: string }> = [{id: null, value: null}];
  @Input() isDisabled: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter();
  reasonList: IType[];
  action = 'Action ';
  filter: FormGroup = this.fb.group({
    type: [-1]
  });
  private unsubscribe = new Subject<void>();

  constructor(
    private typesService: TypesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.filter.get('type').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      if (+res > 0) {
        this.changeFilter.emit(`${this.keyword} eq ${res}`);
      } else {
        this.changeFilter.emit(null);
      }
    });
    this.getTypes();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDisabled) {
      this.filter.get('type').disable();
    } else {
      this.filter.get('type').enable();
    }
  }

  async getTypes(): Promise<void> {
    try {
      this.typesService.getTypes(TypeCategory.Reasons)
        .subscribe(
          resp => {
            this.reasonList = resp.data;
          }
        );
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
    }
  }

  setDefaultReason(): void {
    this.filter.get('type').setValue(-1);
  }
}
