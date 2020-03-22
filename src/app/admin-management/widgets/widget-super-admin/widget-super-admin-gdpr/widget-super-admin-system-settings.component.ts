import { Component, OnInit } from '@angular/core';
// One - Services
import { settingsWindowSystemSettings } from '../../../meta/settings-window-meta';
import { EVENT_MESSAGE } from '../../../meta/admin-event-message';

interface IMenuItem {
  name: string;
  className: string;
  title: string;
}

@Component({
  selector: 'one-admin-widget-super-admin-system-settings',
  templateUrl: './widget-super-admin-system-settings.component.html',
  styleUrls: ['./widget-super-admin-system-settings.component.scss']
})
export class WidgetSuperAdminSystemSettingsComponent implements OnInit {

  meta = settingsWindowSystemSettings;
  selectedMenu: IMenuItem = this.meta.menus[0];

  data: any = null;

  ngOnInit(): void {
    if (this.data) {
      if (this.data.message === EVENT_MESSAGE.SETTING_OPEN_BACKGROUND_TAB) {
        this.selectedMenu = this.meta.menus[0];
      }
    }
  }

}
