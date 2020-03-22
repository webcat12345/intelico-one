import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// One - Services
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { IdentifierType } from '@one-core/model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getIdentifierTypes } from '../../../state/reducers';

@Component({
  selector: 'one-admin-identifier-type-filter',
  templateUrl: './identifier-type-filter.component.html',
  styleUrls: ['./identifier-type-filter.component.scss']
})
export class IdentifierTypeFilterComponent implements OnInit, OnDestroy {

  @Input() keyword: string;
  @Input() customFilter = true;
  @Input() isSelectType: boolean;
  @Input() isFilteredIdentifiers: boolean;
  @Input() filteredIdentifiers: Array<{ id: number, value: string }> = [{id: null, value: null}];
  @Output() changeFilter: EventEmitter<string> = new EventEmitter();
  identifierType$ = this.store.pipe(select(getIdentifierTypes), map(data => {
    const types = data.filter(x => x.id !== IdentifierType.Video) || [];
    if (this.customFilter) {
      types.unshift({id: -1, value: 'Any'});
    } else if (this.isSelectType) {
      types.unshift({id: -1, value: 'Please select type'});
    }
    return types;
  }));
  filter: FormGroup = this.fb.group({
    type: [-1]
  });
  private unsubscribe = new Subject<void>();

  constructor(
    private store: Store<any>,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.filter.get('type').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      if (+res > 0) {
        if (this.customFilter) {
          this.changeFilter.emit(`${this.keyword} eq ${res}`);
        }
        if (!this.customFilter) {
          this.changeFilter.emit(`${res}`);
        }
      } else {
        this.changeFilter.emit(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public setAnyIdentifierType(): void {
    this.filter.get('type').setValue(-1);
  }
}
