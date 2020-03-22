import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgGridConfig, NgGridItemConfig, NgGridItemEvent } from '../../lib/angular2-grid/interfaces/INgGrid';
import { OpenedWindows, Widget } from '../../models';
import { adminMeta, gridConfig, WindowMenuType, WindowName } from '../../meta/admin-meta';

import { AdminManagementService } from '../../services/admin-management.service';
import { environment } from '../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { EVENT_MESSAGE } from '../../meta/admin-event-message';
import { CommonService } from '@one-core/service/common.service';
import { UserRole } from '../../../core/models/authentication';

@Component({
  selector: 'one-admin-admin-viewport',
  templateUrl: './admin-viewport.component.html',
  styleUrls: ['./admin-viewport.component.scss']
})
export class AdminViewportComponent implements OnInit, OnDestroy {

  @Input() boxes: Array<Widget> = [];
  @Input() openedWindows: OpenedWindows;

  desktopMenu: Array<any> = [
    {label: 'Change settings', windowType: WindowName.Settings},
  ];
  gridConfig: NgGridConfig = gridConfig as NgGridConfig;

  private curNum;
  private addNewBoxSubscription: Subscription = new Subscription();
  private boxCloseEventSubscription: Subscription = new Subscription();

  constructor(
    public adminManagementService: AdminManagementService,
    private commonService: CommonService
  ) {
    this.curNum = 101;
  }

  ngOnInit(): void {
    this.checkRoleOverWindows();
    this.addNewBoxSubscription = this.adminManagementService.addNewBoxSubject$.pipe(delay(10))
      .subscribe(res => {
        this.addBox(res);
        this.checkRoleOverWindows();
      });
    this.boxCloseEventSubscription = this.adminManagementService.boxCloseEventSubject$.subscribe(data => {
      this.removeWidget(data.box_index);
    });
  }

  ngOnDestroy(): void {
    this.addNewBoxSubscription.unsubscribe();
    this.boxCloseEventSubscription.unsubscribe();
  }

  addBox(widget): void {
    const conf: NgGridItemConfig = this._generateItemConfig(widget);
    conf.payload = this.curNum++;
    widget.id = conf.payload;
    widget.config = conf;
    this.boxes.push(widget);
    this.setActive(this.boxes.length - 1);
  }

  closeWindow(index: number, box: Widget): void {
    this.adminManagementService.boxCloseEvent(index, box);
  }

  changeState(index: number): void {
    if (this.boxes[index]) {
      if (this.boxes[index].state === 'maximized') {
        this.restoreWidget(index);
        this.adminManagementService.boxStateChange(index);
      } else {
        this.maximizeWidget(index);
        this.adminManagementService.boxStateChange(index);
      }
    }
  }

  minimizeWidget(index: number): void {
    if (this.boxes[index]) {
      this.boxes[index].active = false;
      this.boxes[index].state = 'minimized';
      this.adminManagementService.playSound(environment.sounds.minimize);
    }
  }

  maximizeWidget(index: number): void {
    if (this.boxes[index]) {
      this.boxes[index].state = 'maximized';
      this.setActive(index);
      this.adminManagementService.playSound(environment.sounds.maximize);
    }
  }

  restoreWidget(index: number): void {
    if (this.boxes[index]) {
      this.boxes[index].state = 'normal';
      this.setActive(index);
    }
  }

  activeWidget(index: number): void {
    setTimeout(() => {
      if (this.boxes[index]) {
        this.setActive(index);
      }
    }, 300);
  }

  onDrag(index: number, event: NgGridItemEvent): void {
    setTimeout(() => {
      if (this.boxes[index]) {
        this.setActive(index);
      }
    }, 300);
    // Do something here
  }

  // special offer to open settings window just background tab
  openSettingsWindowBackgroundTab() {
    this.adminManagementService.openAdminSubWindow(WindowName.Settings, false, {message: EVENT_MESSAGE.SETTING_OPEN_BACKGROUND_TAB});
  }

  public setActive(index: number): void {
    if (this.boxes[index]) {
      this.boxes.forEach(box => {
        box.active = false;
        box.config.active = false;
      });
      this.boxes[index].active = true;
      this.boxes[index].config.active = true;
    }
  }

  private removeWidget(index): void {
    if (this.boxes[index]) {
      this.openedWindows[this.boxes[index].type] = false;
      this.boxes.splice(index, 1);
    }
  }

  private _generateItemConfig(widget: Widget): NgGridItemConfig {
    const meta = adminMeta.find(x => x.windowType === widget.type);

    const existingCount = this.boxes.length;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;


    if (meta) {
      return {
        dragHandle: '.handle',
        col: Math.floor((viewportWidth - 10) / 24) - Math.floor(meta.config.sizeX / 2) + existingCount + 2,
        row: Math.floor(((viewportHeight - 10) / 12) / 2) - Math.floor(meta.config.sizeY / 2) + existingCount + 2,
        sizex: meta.config.sizeX,
        sizey: meta.config.sizeY,
        resizable: true
      };
    } else {
      return {dragHandle: '.handle', col: 40, row: 11, sizex: 20, sizey: 1, resizable: true};
    }
  }

  private checkRoleOverWindows() {
    if (this.commonService.userRole !== UserRole.SuperAdmin) {
      // superAdmin window menu type is settings and other super admin windows menu types are intelico
      const superWindows = this.boxes.filter(x => x.menuType === WindowMenuType.SuperAdmin || x.type === WindowName.SuperAdmin);
      if (superWindows) {
        superWindows.forEach(x => {
          const index = this.boxes.findIndex(origin => origin.type === x.type);
          this.removeWidget(index);
        });
      }
    }
  }

}
