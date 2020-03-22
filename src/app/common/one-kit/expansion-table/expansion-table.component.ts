import { Component, DoCheck, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { shrinkInOut } from '@one-animation/common.animations';

export enum CellType {
  default = 0,
  template,
  empty,
  date,
  secondLevel
}

export interface CellInfo {
  type: CellType;
  templateRef?: TemplateRef<any>;
}

export interface ExpansionTableColumnInfo {
  header: CellInfo;
  content: CellInfo;

  name?: string;
  value?: string;
  label?: string;
  width?: string;
  classes?: string;
}

@Component({
  selector: 'one-admin-expansion-table',
  templateUrl: './expansion-table.component.html',
  styleUrls: ['./expansion-table.component.scss'],
  animations: [shrinkInOut()]
})
export class ExpansionTableComponent implements DoCheck {

  @ViewChild('bntScrollTop', {static: true}) bntScrollTop: ElementRef;

  @Input() columns: ExpansionTableColumnInfo[] = [];
  @Input() data: any[] = [];
  @Input() dataSecondLevel: string;
  @Input() itemName: string;
  @Input() detailTemplate: TemplateRef<any>;
  @Input() customRowFooter: TemplateRef<any>;
  @Input() tableName: string;
  @Input() searchKey: string;
  @Input() filterBy: string;
  @Input() scrollToTop: boolean;
  @Output() rowExpanded: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  CellType = CellType;

  ngDoCheck(): void {
    if (this.scrollToTop) {
      this.bntScrollTop.nativeElement.click();
    }
  }

  expandRow(row: any): void {
    if (row.expanded) {
      row.expanded = false;
    } else {
      this.data.map(x => x.expanded = false);
      row.expanded = true;
      this.rowExpanded.emit(row);
    }
  }

}
