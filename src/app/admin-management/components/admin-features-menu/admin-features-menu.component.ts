import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonService } from '@one-core/service/common.service';
import { UserService } from '@one-core/service/user.service';
import { OpenedWindows, Widget } from '../../models';
import { ToastrService } from '../../services/toastr.service';
import { adminMeta, WindowName } from '../../meta/admin-meta';
import { UserRole } from '../../../core/models/authentication';

@Component({
  selector: 'one-admin-admin-features-menu',
  templateUrl: './admin-features-menu.component.html',
  styleUrls: ['./admin-features-menu.component.scss']
})
export class AdminFeaturesMenuComponent implements OnInit, AfterViewInit {

  @Input() openedWindows: OpenedWindows;
  @Input() boxes: Array<Widget>;
  @Output() clickMenuEntry: EventEmitter<string> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();

  featureMenuEntries = adminMeta.filter(x => x.menuType === 'featured');
  menus = [];

  constructor(
    private toastr: ToastrService,
    public commonService: CommonService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getAccount();
    }, 4000);
  }

  getAccount() {
    this.userService.getAccount().subscribe((res) => {
      if (res) {
        this.commonService.currentUser = res.item;
      }
      this.menus.length ? this.menus = [] : this.menus = adminMeta.filter((x: any) => x.menuType === WindowName.Settings);
      if (this.commonService.userRole !== UserRole.SuperAdmin) {
        const index = this.menus.findIndex((x: any) => x.windowType === WindowName.SuperAdmin);
        if (index > -1) {
          this.menus.splice(index, 1);
        }
      }
    }, error => {
      this.toastr.error(null, error);
    });
  }

  openStandardWindows(windowType: string): void {
    this.clickMenuEntry.emit(windowType);
  }

  onMenuItemClick(windowType: string): void {
    if (windowType === 'logout') {
      this.logout.emit();
    } else {
      this.clickMenuEntry.emit(windowType);
    }
  }

  showDesktop(): void {
    let isAllMinimized = true;
    this.boxes.forEach(box => {
      if (box.state !== 'minimized') {
        isAllMinimized = false;
      }
    });
    if (isAllMinimized) {
      this.boxes.forEach(box => {
        box.state = 'normal';
        box.active = false;
      });
    } else {
      this.boxes.forEach(box => {
        box.state = 'minimized';
        box.active = false;
      });
    }
  }
}
