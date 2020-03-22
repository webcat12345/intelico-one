import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import * as screenfull from 'screenfull';
import { adminMeta } from '../../meta/admin-meta';
import { UserRole } from '../../../core/models/authentication';

import { CommonService } from '@one-core/service/common.service';
import { AdminManagementService } from '../../services/admin-management.service';
import { FeatureFlagService } from '@one-core/service/feature-flag.service';

@Component({
  selector: 'one-admin-admin-settings-menu',
  templateUrl: './admin-settings-menu.component.html',
  styleUrls: ['./admin-settings-menu.component.scss']
})
export class AdminSettingsMenuComponent implements OnInit, OnDestroy {

  @Output() openWindow: EventEmitter<string> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();

  adminMenus = adminMeta.filter(x => x.menuType === 'admin');
  superAdminMenus = adminMeta.filter(x => x.menuType === 'intelico');

  isFullScreen = false; // system is full screen mode or not
  muted = false;
  UserRole = UserRole;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  // public time: Date = new Date();
  constructor(
    public commonService: CommonService,
    private adminService: AdminManagementService,
    private featureService: FeatureFlagService
  ) {
  }

  ngOnInit(): void {
    this.buildAdminMenu();
    this.featureService.settingsChanged$.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe(settings => {
      this.buildAdminMenu();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  openSubWidows(windowType): void {
    this.adminService.openAdminSubWindow(windowType);
  }

  toggleFullScreen(): void {
    if (screenfull && screenfull.isEnabled) {
      screenfull.toggle();
      this.isFullScreen = !screenfull.isFullscreen;
    }
  }

  toggleAudioSetting(): void {
    this.muted = !this.muted;
    this.adminService.muteAudio(this.muted);
  }

  private buildAdminMenu() {
    this.adminMenus = adminMeta.filter(item => {
      if (item.menuType === 'admin') {
        if (item.menuLabel === 'Products') {
          return this.featureService.isFeatureNameActivated('Products');
        } else if (item.menuLabel === 'Outputs') {
          return this.featureService.isFeatureNameActivated('Outputs');
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }

}
