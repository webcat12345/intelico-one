import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgGridModule } from './lib/angular2-grid/modules/NgGrid.module';
import { NgPipesModule } from 'ngx-pipes';
import { ContextMenuModule } from 'ngx-contextmenu';
import { OneDirectiveModule } from '@one-common/directive';

import { WidgetsModule } from './widgets/widgets.module';

import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminAlertsMenuComponent } from './components/admin-alerts-menu/admin-alerts-menu.component';
import { AdminFeaturesMenuComponent } from './components/admin-features-menu/admin-features-menu.component';
import { AdminViewportComponent } from './components/admin-viewport/admin-viewport.component';
import { AdminWindowContentComponent } from './components/admin-window-content/admin-window-content.component';
import { AdminLogoutModalComponent } from './components/admin-logout-modal/admin-logout-modal.component';
import { ClickSoundDirective } from './directives/click-sound.directive';
import { AdminIdleModalComponent } from './components/admin-idle-modal/admin-idle-modal.component';
import { AdminChatBotComponent } from './components/admin-chat-bot/admin-chat-bot.component';

import { IsMenuActivePipe } from './pipes/is-menu-active.pipe';
import { SecToMinutesPipe } from './pipes/sec-to-minutes.pipe';
import { LoaderModule } from '@one-common/ui-kit/loader/loader.module';
import { OnePipeModule } from '@one-common/pipe';
import { AdminSettingsMenuComponent } from './components/admin-settings-menu/admin-settings-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ContextMenuModule.forRoot(),
    NgGridModule,
    WidgetsModule,
    NgPipesModule,
    OneDirectiveModule,
    LoaderModule,
    OnePipeModule,
  ],
  declarations: [
    AdminNavComponent,
    AdminAlertsMenuComponent,
    AdminFeaturesMenuComponent,
    AdminViewportComponent,
    AdminWindowContentComponent,
    AdminLogoutModalComponent,
    ClickSoundDirective,
    AdminIdleModalComponent,
    IsMenuActivePipe,
    SecToMinutesPipe,
    AdminChatBotComponent,
    AdminSettingsMenuComponent,
  ],
  exports: [
    AdminNavComponent,
    AdminAlertsMenuComponent,
    AdminFeaturesMenuComponent,
    AdminViewportComponent,
    AdminLogoutModalComponent,
    ClickSoundDirective,
    AdminIdleModalComponent,
    AdminChatBotComponent,
    AdminSettingsMenuComponent
  ]
})
export class AdminManagementModule {
}
