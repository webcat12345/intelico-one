import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TypeCategory, TypeList, TypesService } from '@one-core/service/types.service';

@Component({
  selector: 'one-admin-value-filter',
  templateUrl: './value-filter.component.html',
  styleUrls: ['./value-filter.component.scss']
})
export class ValueFilterComponent implements OnInit, OnChanges {

  @Input() fields: string[] = [];
  @Input() isDisabled: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();

  valueFilterForm: FormGroup;
  filterQuery = '';
  typesCondition: TypeList;

  constructor(
    private fb: FormBuilder,
    private typesService: TypesService
  ) {
  }

  ngOnInit() {
    this.valueFilterForm = this.fb.group({
      value: ['Any', Validators.required]
    });

    this.valueFilterForm.valueChanges.subscribe((form: any) => {
      if (form.value && form.value !== 'Any') {
        const qs = [];
        this.fields.forEach(x => {
          qs.push(`contains(${x}, '${form.value}')`);
        });
        this.filterQuery = qs.join(' or ');
        this.changeFilter.emit(`(${this.filterQuery})`);
      } else {
        this.changeFilter.emit('');
      }
    });
    this.typesService.getTypes(TypeCategory.Condition).subscribe(
      res => {
        if (res.data.length) {
          this.typesCondition = res;
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (this.isDisabled) {
        this.valueFilterForm.get('value').disable();
      } else {
        this.valueFilterForm.get('value').enable();
      }
    }, 500);
  }

  setDefaultValue() {
    this.valueFilterForm.get('value').setValue('Any');
  }

}
