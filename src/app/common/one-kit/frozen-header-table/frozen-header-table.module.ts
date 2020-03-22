import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OnePipeModule } from '@one-common/pipe';
import { OneDirectiveModule } from '@one-common/directive';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { FrozenHeaderTableComponent } from './frozen-header-table.component';
import { UiSwitchModule } from '@one-common/ui-kit/ui-switch/ui-switch.module';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    FontAwesomeModule,
    LoaderModule,
    OnePipeModule,
    UiSwitchModule,
    OneDirectiveModule
  ],
  exports: [
    FrozenHeaderTableComponent
  ],
  declarations: [
    FrozenHeaderTableComponent
  ]
})
export class FrozenHeaderTableModule {
}
