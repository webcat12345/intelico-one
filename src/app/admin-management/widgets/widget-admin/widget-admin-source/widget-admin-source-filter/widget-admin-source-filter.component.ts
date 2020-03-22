import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
// One - Services
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { ValueFilterComponent } from '@one-common/filter/value-filter/value-filter.component';
import { SourceFilterComponent } from '@one-common/filter/source-filter/source-filter.component';
import { SearchKeyFilterComponent } from '@one-common/filter/search-key-filter/search-key-filter.component';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';
import { IdentifierTypeFilterComponent } from '@one-common/filter/identifier-type-filter/identifier-type-filter.component';

@Component({
  selector: 'one-admin-widget-admin-source-filter',
  templateUrl: './widget-admin-source-filter.component.html',
  styleUrls: ['./widget-admin-source-filter.component.scss']
})
export class WidgetAdminSourceFilterComponent {

  @ViewChild(SearchKeyFilterComponent, {static: true}) searchKeyFilter: SearchKeyFilterComponent;
  @ViewChild(DateRangeFilterComponent, {static: true}) dateRangeFilter: DateRangeFilterComponent;
  @ViewChild(IdentifierTypeFilterComponent, {static: true}) identifierTypeFilter: IdentifierTypeFilterComponent;
  @ViewChild(SourceFilterComponent, {static: true}) sourceFilter: SourceFilterComponent;
  @ViewChild(ValueFilterComponent, {static: true}) valueFilter: ValueFilterComponent;

  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeFilterBtn: EventEmitter<string> = new EventEmitter<string>();
  @Output() scrollToBottom: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchSelectedMapData: EventEmitter<AssetsData> = new EventEmitter<AssetsData>();

  queries = ['', '', '', '', '', ''];
  selectedMapData: AssetsData;

  filterChangedDateOrLocations(e): void {
    this.changeFilter.emit(e.data);
    /* if (e.index === 4) {
       this.queries[4] = e.data;
     }
     if (e.index === 5) {
       this.queries[5] = e.data;
     }
     this.changeFilter.emit(this.queries.filter(x => x).join(' and '));*/
  }

  selectForMapDate(e): void {
    this.selectedMapData = e;
  }

  clearSearch(): void {
    this.dateRangeFilter.clearLocations();
    this.searchSelectedMapData.emit(this.selectedMapData);
  }

  searchSource(): void {
    this.searchSelectedMapData.emit(this.selectedMapData);
  }
}
