import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgPipesModule } from 'ngx-pipes';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { OneMapModule } from '@one-common/map';
import { OneDirectiveModule } from '@one-common/directive';
import { AddressAutoCompleteInputModule } from '@one-common/ui-kit/address-auto-complete-input/address-auto-complete-input.module';
import { FrozenHeaderTableModule } from '@one-common/ui-kit/frozen-header-table/frozen-header-table.module';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';

import { WidgetAdminSiteComponent } from './widget-admin-site.component';
import { WidgetAdminSiteAddComponent } from './widget-admin-site-add/widget-admin-site-add.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    TooltipModule,
    OneMapModule,
    AddressAutoCompleteInputModule,
    FrozenHeaderTableModule,
    OneDirectiveModule,
    LoaderModule
  ],
  exports: [
    WidgetAdminSiteComponent
  ],
  declarations: [
    WidgetAdminSiteComponent,
    WidgetAdminSiteAddComponent
  ],
  entryComponents: [
    WidgetAdminSiteComponent
  ]
})
export class WidgetAdminSiteModule {
}
