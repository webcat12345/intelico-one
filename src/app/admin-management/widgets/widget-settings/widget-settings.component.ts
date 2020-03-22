import { Component, OnInit } from '@angular/core';
import { settingsWindowMeta } from '../../meta/settings-window-meta';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';

interface IMenuItem {
  name: string;
  className: string;
  title: string;
}

@Component({
  selector: 'one-admin-widget-settings',
  templateUrl: './widget-settings.component.html',
  styleUrls: ['./widget-settings.component.scss']
})
export class WidgetSettingsComponent implements OnInit {

  meta = settingsWindowMeta;
  selectedMenu: IMenuItem = this.meta.menus[0];

  data: any = null;

  constructor() {
  }

  ngOnInit() {
    if (this.data) {
      if (this.data.message === EVENT_MESSAGE.SETTING_OPEN_BACKGROUND_TAB) {
        this.selectedMenu = this.meta.menus[0];
      }
    }
  }
}
