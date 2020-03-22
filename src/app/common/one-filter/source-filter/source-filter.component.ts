import { Component, EventEmitter, Input, Output } from '@angular/core';

// One - Services

@Component({
  selector: 'one-admin-source-filter',
  templateUrl: './source-filter.component.html',
  styleUrls: ['./source-filter.component.scss']
})
export class SourceFilterComponent {

  @Input() dropdownSources: Array<any> = [];
  @Input() source = 'default';
  @Input() isSource = true;
  @Output() changeFilter: EventEmitter<string> = new EventEmitter<string>();


  selectValue(e) {
    this.source = e;
    if (this.source !== 'default') {
      //  const parsedString = this.source.replace(/'/g, '"');
      //  this.changeFilter.emit(this.source ? `source eq '${parsedString}'` : '');
      this.changeFilter.emit(this.source ? `sourceId eq ${this.source}` : '');
    } else {
      this.changeFilter.emit('');
    }
  }

  setDefaultSource() {
    this.source = 'default';
  }

}
