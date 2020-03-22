import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

// One - Services
import { AssetsData } from '@one-common/ui-kit/layer-selector/layer-selector.component';
import { DateRangeFilterComponent } from '@one-common/filter/date-range-filter/date-range-filter.component';

@Component({
  selector: 'one-admin-widget-admin-area-filter',
  templateUrl: './widget-admin-area-filter.component.html',
  styleUrls: ['./widget-admin-area-filter.component.scss']
})
export class WidgetAdminAreaFilterComponent {

  @ViewChild(DateRangeFilterComponent, {static: true}) dateRangeFilter: DateRangeFilterComponent;
  @Output() searchSelectedMapData: EventEmitter<AssetsData> = new EventEmitter<AssetsData>();
  selectedMapData: AssetsData;

  selectForMapDate(e): void {
    this.selectedMapData = e;
  }

  clearSearch(): void {
    this.dateRangeFilter.clearLocations();
    this.searchSelectedMapData.emit(this.selectedMapData);
  }

  search(): void {
    this.searchSelectedMapData.emit(this.selectedMapData);
  }
}
