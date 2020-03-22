import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'one-admin-search-key-filter',
  templateUrl: './search-key-filter.component.html',
  styleUrls: ['./search-key-filter.component.scss']
})
export class SearchKeyFilterComponent implements OnInit, OnDestroy {

  @Input() fields: string[] = [];
  @Input() noLabel: boolean;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterSearchKey: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterPressKey: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterClearAll: EventEmitter<boolean> = new EventEmitter<boolean>();

  searchKeyFilterForm = this.formBuilder.group({
    searchKey: ['']
  });
  filterQuery = '';
  formSearchKey: string;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchKeyFilterForm.valueChanges.subscribe((form: any) => {
        this.formSearchKey = form.searchKey;
        if (form.searchKey) {
          const qs = [];
          this.fields.forEach(x => {
            qs.push(`contains(${x}, '${form.searchKey}')`);
          });
          this.filterQuery = qs.join(' or ');
          if (this.noLabel) {
            //  this.changeFilterSearchKey.emit(`${form.searchKey}`);
          }
          this.changeFilterPressKey.emit(`${this.filterQuery}`);
          //  this.changeFilter.emit(`(${this.filterQuery})`);
        } else {
          this.changeFilterPressKey.emit('');
          //  this.changeFilter.emit('');
          if (this.noLabel) {
            //  this.changeFilterSearchKey.emit(null);
          }
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s => s.unsubscribe()));
  }

  search(identifier): void {
    this.searchKeyFilterForm.get('searchKey').setValue(identifier);
  }

  clear(): void {
    this.searchKeyFilterForm.get('searchKey').setValue('');
  }

  clearAllFilters(): void {
    this.changeFilterClearAll.emit(true);
  }

  keyDown(event): void {
    if (event.keyCode === 13) {
      if (this.formSearchKey) {
        const qs = [];
        this.fields.forEach(x => {
          qs.push(`contains(${x}, '${this.formSearchKey}')`);
        });
        this.filterQuery = qs.join(' or ');
        if (this.noLabel) {
          this.changeFilterSearchKey.emit(`${this.formSearchKey}`);
        }
        this.changeFilter.emit(`${this.filterQuery}`);
      } else {
        this.changeFilter.emit('');
        if (this.noLabel) {
          this.changeFilterSearchKey.emit(null);
        }
      }
    }
  }
}
