import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SidebarWindowComponent } from './sidebar-window/sidebar-window.component';
import { OneDirectiveModule } from '@one-common/directive';

@NgModule({
  imports: [
    CommonModule,
    OneDirectiveModule,
    FontAwesomeModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    SidebarWindowComponent
  ],
  exports: [
    SidebarWindowComponent,
    FontAwesomeModule
  ]
})
export class OneWindowModule {
}
