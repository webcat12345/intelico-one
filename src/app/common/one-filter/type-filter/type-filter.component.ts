import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOption } from '@one-common/filter/one-filter.model';

@Component({
  selector: 'one-admin-type-filter',
  templateUrl: './type-filter.component.html',
  styleUrls: ['./type-filter.component.scss']
})
export class TypeFilterComponent implements OnInit {

  @Input() keyword = '';
  @Input() typeOptions: TypeOption[] = [];
  @Input() isSearchFilter = false; // filter will search base on contains string
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();

  typeFilterForm: FormGroup;
  filterQuery = '';

  now = new Date().toString();

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.typeFilterForm = this.formBuilder.group({...this.createTypeFilterForm()});
    this.typeFilterForm.valueChanges.subscribe(value => {
      const queries = Object.keys(value)
        .filter(key => value[key])
        .map(key => {
          if (this.isSearchFilter) {
            return `contains(${this.keyword}, ${this.typeOptions.find(x => x.name === key).value})`;
          } else {
            return `${this.keyword} eq ${this.typeOptions.find(x => x.name === key).value}`;
          }
        });
      this.filterQuery = queries.join(' or ');
      this.changeFilter.emit(this.filterQuery ? `(${this.filterQuery})` : '');
    });
  }

  createTypeFilterForm() {
    const value: any = {};
    this.typeOptions.map(option => {
      value[option.name] = [true, Validators.required];
    });
    return value;
  }

}
