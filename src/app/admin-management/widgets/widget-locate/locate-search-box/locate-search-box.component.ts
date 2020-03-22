import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// One - Services
import { select, Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { EventService } from '@one-core/service/event.service';
import { LocateService } from '../services/locate.service';
import { ToastrService } from '../../../services/toastr.service';
import { AdminManagementService } from '../../../services/admin-management.service';
import { getIdentifierTypesNotVideo } from '../../../../state/reducers';
import { removeDuplicates } from '../../../../core/utils/common.util';
import { SourceService } from '@one-core/service/source.service';

@Component({
  selector: 'one-admin-locate-search-box',
  templateUrl: './locate-search-box.component.html',
  styleUrls: ['./locate-search-box.component.scss']
})
export class LocateSearchBoxComponent implements OnInit, OnDestroy {

  @Input() filterString = '';
  @Output() clear: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideSidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() isSearchFInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

  noResult = false;
  identifierType$ = this.store.pipe(select(getIdentifierTypesNotVideo));
  searchForm: FormGroup = this.formBuilder.group({
    identifierType: [null, Validators.required],
    searchKey: ['', Validators.required]
  });
  filteredIdentifiers: Array<{ id: number, value: string }> = [{id: null, value: null}];
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private locateService: LocateService,
    private eventService: EventService,
    private sourceService: SourceService,
    private adminService: AdminManagementService,
    private toastrService: ToastrService,
    private store: Store<any>
  ) {
  }

  private static _buildDateQuery(range): string {
    return `(createdAt ge ${range.start} and createdAt lt ${range.end})`;
  }

  private static _getDateRange(option: number) {
    const now = new Date();
    let start = now.toISOString();
    let end = now.toISOString();
    if (option === 1) {
      start = new Date(new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).toISOString();
      end = new Date(new Date(new Date().getTime())).toISOString();
    }
    return {start, end};
  }

  ngOnInit() {
    this.filterString = LocateSearchBoxComponent._buildDateQuery(LocateSearchBoxComponent._getDateRange(1));
    this.sourceService.getSources().subscribe((resp) => {
      if (resp.data.length) {
        resp.data.map((item, index) => {
          this.filteredIdentifiers[index] = {id: item.identifierType.id, value: item.identifierType.value};
        });
      }
      this.filteredIdentifiers = removeDuplicates(this.filteredIdentifiers, 'id');
    });
    this.locateService.locate$.pipe(takeUntil(this.unsubscribeAll)).subscribe(res => {
      this.noResult = !res.identifier;
      if (!res.identifier && this.searchForm.get('searchKey').value) {
        this.toastrService.warning('No items found.');
      }
    });
    this.searchForm.get('searchKey').disable();
    this.searchForm.get('identifierType').valueChanges.subscribe(value => {
      if (value) {
        this.searchForm.get('searchKey').enable();
      } else {
        this.searchForm.get('searchKey').disable();
      }
    });

    setTimeout(() => {
      if (this.searchForm.get('searchKey').value === '') {
        this.isSearchFInvalid.emit(false);
      }
      if (this.searchForm.get('searchKey').value !== '') {
        this.isSearchFInvalid.emit(true);
      }
    }, 950);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  search(identifier = null, keepPage = false, withFilterString = true): void {
    if (this.searchForm.get('searchKey').value !== '') {
      this.isSearchFInvalid.emit(true);
    }
    if (this.searchForm.get('searchKey').value === '') {
      this.isSearchFInvalid.emit(false);
    }

    if (identifier) {
      this.searchForm.get('searchKey').setValue(identifier);
    }
    if (this.searchForm.invalid) {
      return;
    }
    if (!keepPage) {
      this.locateService.currentPage = 1;
    }
    this.locateService.search(this.searchForm.value.searchKey, withFilterString ? this.filterString : '');
  }

  clearSearch(): void {
    this.searchForm.get('searchKey').setValue('');
    this.clear.emit();
    this.hideSidebar.emit();
    this.isSearchFInvalid.emit(false);
  }

  observableSource = (keyword: string): Observable<string[]> => {
    //  this.filterString = LocateSearchBoxComponent._buildDateQuery(LocateSearchBoxComponent._getDateRange(1));
    if (this.searchForm.get('searchKey').value !== '') {
      this.isSearchFInvalid.emit(true);
    }
    if (this.searchForm.get('searchKey').value === '') {
      this.isSearchFInvalid.emit(false);
    }
    if (keyword) {
      return this.eventService.searchPlate(keyword, this.searchForm.get('identifierType').value, this.filterString)
        .pipe(
          map((res: any) => res.results.map(item => item.identifier))
        );
    } else {
      return of([]);
    }
  }

}
