import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { CommonModule } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';
import { OnePipeModule } from '@one-common/pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { OneWindowModule } from '@one-common/window';
import { OneFilterModule } from '@one-common/filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OneDirectiveModule } from '@one-common/directive';
import { ExpansionTableModule } from '@one-common/ui-kit/expansion-table/expansion-table.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneMapModule } from '@one-common/map';
import { AddressAutoCompleteInputModule } from '@one-common/ui-kit/address-auto-complete-input/address-auto-complete-input.module';
// One - Services
import { WidgetAdminPeopleStateService } from './services/widget-admin-people-state.service';
// One - Components
import { WidgetAdminPeopleTableComponent } from './widget-admin-people-table/widget-admin-people-table.component';
import { WidgetAdminPeopleSidebarComponent } from './widget-admin-people-sidebar/widget-admin-people-sidebar.component';
import { WidgetAdminPeopleComponent } from './widget-admin-people.component';
import { WidgetAdminPeopleAddComponent } from './widget-admin-people-add/widget-admin-people-add.component';
import { WidgetAdminPeopleSearchComponent } from './widget-admin-people-search/widget-admin-people-search.component';
import { WidgetAdminPeopleTabImageComponent } from './widget-admin-people-tabs/widget-admin-people-tab-image/widget-admin-people-tab-image.component';
import { WidgetAdminPeopleTabDetailComponent } from './widget-admin-people-tabs/widget-admin-people-tab-detail/widget-admin-people-tab-detail.component';
import { WidgetAdminPeopleTabCompanyComponent } from './widget-admin-people-tabs/widget-admin-people-tab-company/widget-admin-people-tab-company.component';
import { WidgetAdminPeopleSearchResultComponent } from './widget-admin-people-search-result/widget-admin-people-search-result.component';
import { WidgetAdminPeopleTabAdditionalComponent } from './widget-admin-people-tabs/widget-admin-people-tab-additional/widget-admin-people-tab-additional.component';
import { WidgetAdminPeopleIdentifiersComponent } from './widget-admin-people-identifiers/widget-admin-people-identifiers.component';
import { WidgetAdminPeopleIdentifiersDetailComponent } from './widget-admin-people-identifiers/widget-admin-people-identifiers-detail/widget-admin-people-identifiers-detail.component';
import { WidgetAdminPeopleBadgeComponent } from './widget-admin-people-badge/widget-admin-people-badge.component';
import { WidgetAdminPeopleGroupsComponent } from './widget-admin-people-groups/widget-admin-people-groups.component';
import { WidgetAdminPeopleGroupsDetailComponent } from './widget-admin-people-groups/widget-admin-people-groups-detail/widget-admin-people-groups-detail.component';
import { WidgetAdminPeopleProductsComponent } from './widget-admin-people-products/widget-admin-people-products.component';
import { WidgetAdminPeopleProductsDetailComponent } from './widget-admin-people-products/widget-admin-people-products-detail/widget-admin-people-products-detail.component';
import { WidgetAdminPeopleComplianceComponent } from './widget-admin-people-compliance/widget-admin-people-compliance.component';
import { WidgetAdminPeopleAlphabetFilterComponent } from './widget-admin-people-alphabet-filter/widget-admin-people-alphabet-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OnePipeModule,
    OneMapModule,
    AddressAutoCompleteInputModule,
    ExpansionTableModule,
    OneFilterModule,
    TooltipModule.forRoot(),
    OneWindowModule,
    NgPipesModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule
  ],
  exports: [WidgetAdminPeopleComponent],
  entryComponents: [
    WidgetAdminPeopleComponent
  ],
  providers: [
    WidgetAdminPeopleStateService
  ],
  declarations: [
    WidgetAdminPeopleComponent,
    WidgetAdminPeopleAddComponent,
    WidgetAdminPeopleBadgeComponent,
    WidgetAdminPeopleGroupsComponent,
    WidgetAdminPeopleProductsComponent,
    WidgetAdminPeopleProductsDetailComponent,
    WidgetAdminPeopleTableComponent,
    WidgetAdminPeopleSearchComponent,
    WidgetAdminPeopleSidebarComponent,
    WidgetAdminPeopleTabImageComponent,
    WidgetAdminPeopleTabDetailComponent,
    WidgetAdminPeopleComplianceComponent,
    WidgetAdminPeopleTabCompanyComponent,
    WidgetAdminPeopleIdentifiersComponent,
    WidgetAdminPeopleSearchResultComponent,
    WidgetAdminPeopleTabAdditionalComponent,
    WidgetAdminPeopleGroupsDetailComponent,
    WidgetAdminPeopleAlphabetFilterComponent,
    WidgetAdminPeopleIdentifiersDetailComponent
  ]
})
export class WidgetAdminPeopleModule {
}
