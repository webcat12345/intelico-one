import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetAdminIdentifierAdditionalTabsModule } from './widget-admin-identifier-additional-tabs/widget-admin-identifier-additional-tabs.module';

import { WidgetAdminIdentifierComponent } from './widget-admin-identifier.component';
import { WidgetAdminIdentifierAddComponent } from './widget-admin-identifier-add/widget-admin-identifier-add.component';
import { WidgetAdminIdentifierSearchComponent } from './widget-admin-identifier-search/widget-admin-identifier-search.component';
import { WidgetAdminIdentifierContentComponent } from './widget-admin-identifier-content/widget-admin-identifier-content.component';
import { WidgetAdminIdentifierContentDetailsTabComponent } from './tabs/widget-admin-identifier-content-details-tab/widget-admin-identifier-content-details-tab.component';
import { WidgetAdminIdentifierContentPeopleTabComponent } from './tabs/widget-admin-identifier-content-people-tab/widget-admin-identifier-content-people-tab.component';
import { WidgetAdminIdentifierContentCompaniesTabComponent } from './tabs/widget-admin-identifier-content-companies-tab/widget-admin-identifier-content-companies-tab.component';
import { WidgetAdminIdentifierContentActionsTabComponent } from './tabs/widget-admin-identifier-content-actions-tab/widget-admin-identifier-content-actions-tab.component';
import { WidgetAdminIdentifierContentImagesTabComponent } from './tabs/widget-admin-identifier-content-images-tab/widget-admin-identifier-content-images-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabsModule.forRoot(),
    WidgetAdminIdentifierAdditionalTabsModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminIdentifierComponent
  ],
  declarations: [
    WidgetAdminIdentifierComponent,
    WidgetAdminIdentifierAddComponent,
    WidgetAdminIdentifierSearchComponent,
    WidgetAdminIdentifierContentComponent,
    WidgetAdminIdentifierContentDetailsTabComponent,
    WidgetAdminIdentifierContentPeopleTabComponent,
    WidgetAdminIdentifierContentCompaniesTabComponent,
    WidgetAdminIdentifierContentActionsTabComponent,
    WidgetAdminIdentifierContentImagesTabComponent
  ],
  entryComponents: [
    WidgetAdminIdentifierComponent
  ]
})
export class WidgetAdminIdentifierModule {
}
