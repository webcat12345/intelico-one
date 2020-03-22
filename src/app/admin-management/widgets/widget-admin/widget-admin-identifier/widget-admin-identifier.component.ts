import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IdentifierService, IIdentifier, IIdentifierList } from '@one-core/service/identifier.service';
import { IType, TypeCategory, TypesService } from '@one-core/service/types.service';
import { flyIn } from '@one-animation/flyIn.animation';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { AddStep } from './widget-admin-identifier.enum';
import { IIdentifierType } from './widget-admin-identifier.interface';
import { ToastrService } from '../../../services/toastr.service';

@Component({
  selector: 'one-admin-widget-admin-identifier',
  templateUrl: './widget-admin-identifier.component.html',
  styleUrls: ['./widget-admin-identifier.component.scss'],
  animations: [flyIn(300, 920, true, 0)]
})
export class WidgetAdminIdentifierComponent implements OnInit {

  @Input() isAddWindow: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  enum_AddStep = AddStep;

  showAddModal = false;
  addStep = AddStep.Default;
  selectedType: IIdentifierType = {name: '', className: '', title: '', id: 0};

  info: Array<TableInfo> = [
    {label: 'Identifier', name: 'name', width: '25%', isLink: false},
    {label: 'Type', name: 'typeName', width: '', isLink: false},
    {label: 'People', name: '', width: '20%', isLink: true},
    {label: 'Actions', name: '', width: '15%', isLink: true},
    {label: '', name: '', width: '115px', isLink: false},
  ];

  isLoading = false;
  idList: IIdentifierList = {data: [], totalCount: 0};
  selectedId: IIdentifier = null;
  types: IType[] = [];

  constructor(
    private identifierService: IdentifierService,
    private toastr: ToastrService,
    private typeService: TypesService
  ) {
  }

  ngOnInit() {
    this.showAddModal = this.isAddWindow;
    this.getIdentifiers();
  }

  onSearchFinished(e) {
    this.selectedId = e;
    this.addStep = AddStep.Content;
  }

  async getIdentifiers() {
    try {
      this.isLoading = true;
      const res = await this.typeService.getTypes(TypeCategory.Identifier).toPromise() as any;
      this.types = res.data;
      this.idList = await this.identifierService.getIdentifiers().toPromise() as IIdentifierList;
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  selectIdentifierType(type: IIdentifierType): void {
    this.selectedType = type;
    this.addStep = AddStep.Search;
  }

  closeAddSection(isSuccess: boolean): void {
    if (this.isAddWindow) {
      this.close.emit(true);
    } else {
      this.showAddModal = false;
    }
  }

}
