import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// One - Services
import { LayerCategory } from '@one-core/model';
import { flyIn } from '@one-animation/flyIn.animation';
import { LayerService } from '@one-core/service/layer.service';
import { ToastrService } from '../../../services/toastr.service';
import { UserRole } from '../../../../core/models/authentication';
import { TableInfo } from '@one-common/ui-kit/frozen-header-table/table-info.interface';
import { WidgetAdminSiteAddComponent } from './widget-admin-site-add/widget-admin-site-add.component';

@Component({
  selector: 'one-admin-widget-admin-site',
  templateUrl: './widget-admin-site.component.html',
  styleUrls: ['./widget-admin-site.component.scss'],
  animations: [
    flyIn(300, 460, true, 0),
    flyIn(300, 460, false, 0, 1)
  ]
})
export class WidgetAdminSiteComponent implements OnInit {

  @ViewChild(WidgetAdminSiteAddComponent, {static: false}) addCom: WidgetAdminSiteAddComponent;

  UserRole = UserRole;
  center = {lat: 51.5074, lng: 0.1278};
  showAddModal = false;
  showConfirmModal = false;

  info: Array<TableInfo> = [
    {label: 'Name', name: 'name', width: '18%', isLink: false},
    {label: 'Description', name: 'description', width: '20%', isLink: false, tooltip: true},
    {label: 'Type', name: 'typeValue', width: '13%', isLink: false},
    {label: 'Address', name: 'Address', width: '20%', isLink: false, tooltip: true},
    {label: 'Areas', name: 'childrenCount', width: '10%', isLink: true},
    {label: '', name: 'action_group', width: '115px', isLink: false},
  ];

  isAddModal = false;
  isLoading = false;
  searchKey = '';
  selectedSite: any = null;
  siteList = {data: [], totalCount: 0};

  constructor(
    private cdr: ChangeDetectorRef,
    private layerService: LayerService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getSites();
  }

  async getSites() {
    try {
      this.isLoading = true;
      this.siteList = await this.layerService.getLayers(LayerCategory.Site, 1).toPromise() as any;
      this.siteList.data.map((item) => {
        item.Address = `${item.metaData.address.city} ${item.metaData.address.country} ${item.metaData.address.county} ${item.metaData.address.line1} ${item.metaData.address.line2}`;
        item.description = item.metaData.description;
        item.typeValue = item.type.value;
        if (item.children.length === 0) {
          item.childrenCount = 0;
        } else if (item.children.length > 0) {
          item.childrenCount = item.children.length;
        }
      });
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  onCreateSite() {
    this.isAddModal = true;
    this.selectedSite = null;
    this.showAddModal = true;
  }

  async onEditSite(e) {
    try {
      this.isLoading = true;
      this.isAddModal = false;
      this.selectedSite = e;
      const res: any = await this.layerService.getLayerDetail(this.selectedSite.id).toPromise();
      this.selectedSite.metaData = res.item.metaData;
      this.selectedSite.description = res.item.metaData.description;
      this.showAddModal = true;
      setTimeout(() => {
        this.center = {lat: this.selectedSite.metaData.address.latitude, lng: this.selectedSite.metaData.address.longitude};
      }, 1000);
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.isLoading = false;
    }
  }

  deleteConfirm(e) {
    this.selectedSite = e;
    this.showConfirmModal = true;
  }

  async onRemoveSite(flag) {
    if (!flag) {
      this.showConfirmModal = false;
      this.selectedSite = null;
      return;
    }
    try {
      this.isLoading = true;
      await this.layerService.deleteLayer(this.selectedSite.id).toPromise();
      await this.getSites();
      this.toastr.success('Site deleted.');
    } catch (e) {
      this.toastr.error(null, e);
    } finally {
      this.showConfirmModal = false;
      this.selectedSite = null;
      this.isLoading = false;
    }
  }

  // this function will be called when the map position changed from the sidebar
  placeChanged(e): void {
    this.center = {lat: e.latitude, lng: e.longitude};
  }

  onCloseAddSection(action: any): void {
    if (action.success) {
      this.getSites();
    }
    this.showAddModal = false;
  }
}
