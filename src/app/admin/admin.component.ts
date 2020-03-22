import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { Store } from '@ngrx/store';
import { interval, Subject, timer } from 'rxjs';
import { Keepalive } from '@ng-idle/keepalive';
import { take, takeUntil } from 'rxjs/operators';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LocalStorageService } from 'angular-2-local-storage';

import { CommonService } from '@one-core/service/common.service';
import { ChatbotService } from '@one-core/service/chatbot.service';
import { AdminManagementService } from '../admin-management/services/admin-management.service';
import { PersonalSettingsService } from '../admin-management/services/personal-settings.service';

import { UserRole } from '../core/models/authentication';
import { environment } from '../../environments/environment';
import { adminMeta } from '../admin-management/meta/admin-meta';
import { OpenedWindows, PersonalSettings, Widget } from '../admin-management/models';
import { LoadIdentifierTypes, LoadSourceTypes } from '../state/actions/resource.actions';
import { ToastrService } from '../admin-management/services/toastr.service';
import { FeatureFlagService } from '@one-core/service/feature-flag.service';

declare var bodymovin;

@Component({
  selector: 'one-admin-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() clickMenuEntry: EventEmitter<string> = new EventEmitter();

  boxes: Array<Widget> = [];
  opened_windows: OpenedWindows = new OpenedWindows();

  settings: PersonalSettings = new PersonalSettings();
  hotkeyArray: string[] = environment.hotKeys.map(x => x.key);
  showLogout = false;
  showFeaturedMenu = {
    timer: false,
    mouse: false
  };

  timedOut = true;
  idleShow = false;
  idleCountdown = 0;
  idleCountdownDoCheck = 2400;
  greeting = '';
  UserRole = UserRole;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private adminManagementService: AdminManagementService,
    private featureService: FeatureFlagService,
    private personalSettingsService: PersonalSettingsService,
    private hotKeyService: HotkeysService,
    //  private idle: Idle,
    private keepalive: Keepalive,
    private store: Store<any>,
    public commonService: CommonService,
    private chatbotService: ChatbotService,
    private swUpdate: SwUpdate,
    private toastr: ToastrService
  ) {
    this.loadPersonalSettings(); // load and subscribe personal settings from localstorage
    this.registerHotKeys(); // register hotkeys
  }

  ngOnInit() {
    this.store.dispatch(new LoadIdentifierTypes());
    this.store.dispatch(new LoadSourceTypes());
    this.checkSystemCache(); // check localstorage for last saved windows
    //  this.startIdleLocker(); // check idle time

    this.adminManagementService.playSound(environment.sounds.login);
    timer(0, 60000).pipe(takeUntil(this.unsubscribeAll)).subscribe(t => {
      const curHr = new Date().getHours();
      if (curHr < 12) {
        this.greeting = 'morning';
      } else if (curHr < 18) {
        this.greeting = 'afternoon';
      } else {
        this.greeting = 'evening';
      }
    });

    const animData = {
      wrapper: document.getElementById('bodymovin'),
      animType: 'svg',
      loop: true,
      prerender: true,
      autoplay: true,
      path: 'assets/circle/data.json',
    };
    const anim = bodymovin.loadAnimation(animData);
    anim.addEventListener('DOMLoaded', firstLoop);

    // Create our playback functions
    function firstLoop() {
      anim.playSegments([0, 149], true);
      anim.removeEventListener('DOMLoaded');
      anim.addEventListener('loopComplete', secondLoop);
    }

    function secondLoop() {
      anim.playSegments([150, 316], true);
    }

    setInterval(() => {
      this.idleCountdownDoCheck--;
    }, 1000);

    // check for platform update
    if (this.swUpdate.isEnabled) {
      interval(60000).subscribe(() => this.swUpdate.checkForUpdate().then(() => {
        // checking for updates
      }));
    }
    this.swUpdate.available.subscribe(() => {
      this.toastr.update('A new update is available. Click here to reload.');
    });
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(e) {
    this.idleCountdownDoCheck = 2400;
  }

  @HostListener('document:click', ['$event']) onMouseClick(e) {
    this.idleCountdownDoCheck = 2400;
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChatbotSession();
    }, 4000);
    setTimeout(_ => {
      this.spyAdminSubWindowOpenEvent(); // subscribe admin sub window open event
      this.spyQueryParams(); // subscribe query params after all child components are initialized
      this.spyClosingWindows(); // subscribe windows closing event
      this.spyIdleChecker(); // subscribe idle checker force close event
    });
  }

  checkSystemCache(): void {
    if (this.localStorageService.get(environment.systemCache.opendWindows)
      && this.localStorageService.get(environment.systemCache.boxesArray)) {
      const ow: OpenedWindows = JSON.parse(this.localStorageService.get(environment.systemCache.opendWindows) as string) as OpenedWindows;
      const bs: Widget[] = JSON.parse(this.localStorageService.get(environment.systemCache.boxesArray) as string) as Widget[];

      // exception check required, here is starting point of project so important
      let count = 0;
      Object.keys(ow).forEach(key => {
        if (ow[key]) {
          count++;
        }
      });

      // all check passed
      if (bs.length === count) {
        this.boxes = bs;
        this.opened_windows = ow;
      }
    }
  }

  mouseActFeaturedMenu(enter: boolean): void {
    enter ? this.showFeaturedMenu.mouse = enter : setTimeout(() => this.showFeaturedMenu.mouse = enter, 1000);
  }

  showLogoutModal(flag: boolean): void {
    this.showLogout = flag;
  }

  doLogout(): void {
    this.localStorageService.set(environment.systemCache.opendWindows, JSON.stringify(this.opened_windows));
    this.localStorageService.set(environment.systemCache.boxesArray, JSON.stringify(this.boxes));
    this.localStorageService.remove('AUTH_TOKEN');
    this.localStorageService.remove('REFRESH_AUTH_TOKEN');
    this.localStorageService.remove('USERS_TEAMS');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  doSelectOrg(): void {
    this.router.navigate(['/organization-select']);
  }

  openStandardWindows(window_type: string, isAdd = false, data: any = null): void {
    if (!this.featureService.isFeatureActivated(window_type)) {
      this.toastr.warning('This feature is not activated yet for your organisation. Please contact customer support.');
      return;
    }
    const old = this.boxes.find(x => x.active);
    if (old) {
      old.state = old.state === 'maximized' ? 'normal' : old.state;
    }

    if (!this.opened_windows[window_type]) {

      this.opened_windows[window_type] = true;
      const widget: Widget = new Widget();
      const meta = adminMeta.find(x => x.windowType === window_type);
      if (meta) {
        widget.loading = true;
        widget.title = meta.menuLabel;
        widget.type = window_type;
        widget.menuType = meta.menuType;
        widget.active = true;
        widget.isAdd = meta.menuType === 'admin' ? isAdd : false; // this property should be used for admin windows only
        widget.data = data;
        widget.noMaxBtn = Boolean(meta.noMaxBtn);
        setTimeout(() => {
          widget.loading = false;
        }, 1500);
      } else {
        widget.title = 'New Windows';
      }

      this.updateUrl();

      this.adminManagementService.confirmAddNewBox(widget);

    } else {
      const index = this.adminManagementService.getWindowInfoByType(window_type, this.boxes);
      if (this.boxes[index]) {
        this.boxes[index].state = 'normal';
        this.setActive(index);
      }
    }
  }

  setActive(index: number): void {
    if (this.boxes[index]) {
      this.boxes.forEach(box => {
        box.active = false;
        box.config.active = false;
      });
      this.boxes[index].active = true;
      this.boxes[index].config.active = true;
      this.boxes[index].state = 'normal';
    }
  }

  resetIdleChecker(): void {
    //  this.idle.watch();
    this.idleShow = false;
    this.timedOut = false;
  }

  private registerHotKeys(): void {
    this.hotKeyService.add(new Hotkey(this.hotkeyArray, (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {

      const box: Widget = this.boxes.find(x => x.active);
      const index = this.boxes.findIndex(x => x.active);
      if (!box && combo !== 'a') {
        return;
      }
      switch (combo) {
        case 'esc':
          this.opened_windows[box.type] = false;
          this.boxes.splice(index, 1);
          break;
        case 'f':
          // fullscreen current activated window
          box.state = 'maximized';
          break;
        case 'h':
          // minimize current activated window ! active status should remains.
          box.state = 'minimized';
          break;
        case 'n':
          // set current active window state to normal
          box.state = 'normal';
          break;
        case 'q':
          // close current active window
          this.opened_windows[box.type] = false;
          this.boxes.splice(index, 1);
          break;
        case 'a':
          // toggle alert quee
          this.adminManagementService.toggleAlertQue();
          break;
        case 'm':
          // show featured menu at top for 4 sec ! should consider mouse cursor position
          this.showFeaturedMenu.timer = true;
          setTimeout(() => {
            this.showFeaturedMenu.timer = false;
          }, 4000);
          break;
        default:
          break;
      }

      const e: ExtendedKeyboardEvent = event;
      e.returnValue = false;
      return e;
    }));
  }

  private spyQueryParams(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(qParams => {
      if (!qParams.w) {
        return;
      }
      const preOpenedWindows = qParams.w.split('-');
      if (preOpenedWindows.length) {
        preOpenedWindows.forEach(x => {
          if (adminMeta.find(meta => meta.windowType === x)) {
            this.openStandardWindows(x);
          }
        });
      }
    });
  }

  private spyIdleChecker(): void {
    this.adminManagementService.resetIdleChecker$.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
      this.resetIdleChecker();
    });
  }

  private spyAdminSubWindowOpenEvent(): void {
    this.adminManagementService.openAdminSubWindowSubject$.pipe(takeUntil(this.unsubscribeAll)).subscribe(info => {
      if (this.opened_windows[info.windowType]) {
        const title = adminMeta.find(x => x.windowType === info.windowType).menuLabel;
        if (!info.data) { // Just prevent null or undefined error
          info.data = {};
        }
        if (info.data.triggerInside) {
          this.adminManagementService.triggerEvent$.emit(info);
        }
        const index = this.boxes.findIndex(x => x.type === info.windowType);
        setTimeout(() => {
          this.setActive(index);
        }, 200);
      } else {
        if (!info.data) {
          info.data = {};
        }
        this.openStandardWindows(info.windowType, info.isAdd, info.data);
        if (info.data.triggerInside) {
          setTimeout(() => {
            this.adminManagementService.triggerEvent$.emit(info);
          }, 1000);
        }
      }
    });
  }

  private spyClosingWindows(): void {
    this.adminManagementService.boxCloseEventSubject$.pipe(takeUntil(this.unsubscribeAll)).subscribe(x => {
      this.updateUrl();
    });
  }

  private loadPersonalSettings(): void {
    this.settings = this.personalSettingsService.loadSettings();
    this.personalSettingsService.changeSettings$.pipe(takeUntil(this.unsubscribeAll)).subscribe(change => {
      this.settings = this.personalSettingsService.loadSettings();
    });
  }

  private updateUrl(): void {
    const qP = Object.keys(this.opened_windows).filter(xx => this.opened_windows[xx]);
    this.router.navigate(['/'], {queryParams: {w: qP.join('-')}});
  }

  private createChatbotSession() {
    this.chatbotService.createSession().subscribe();
  }

  private startIdleLocker(): void {
    /* this.idle.setIdle(environment.idle.idleTimer);
     this.idle.setTimeout(environment.idle.idleCountDownTimer);
     this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

     this.idle.onIdleEnd.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
       this.idleShow = false;
     });
     this.idle.onIdleStart.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
     });

     this.idle.onTimeout.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
       this.timedOut = true;
       this.doLogout();
     });

     this.idle.onTimeoutWarning.pipe(takeUntil(this.unsubscribeAll)).subscribe((countdown) => {
       this.idleShow = true;
       this.idleCountdown = countdown;
       /!*
       if (this.idleCountdownDoCheck <= 0) {
         this.idleShow = true;
         this.idleCountdown = this.setIdleCountdown(this.idleCountdown - 1);
       }*!/
     });

     this.keepalive.interval(15);

     this.keepalive.onPing.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
     });

     this.resetIdleChecker();*/
  }

  private setIdleCountdown(idleCountdown) {
    setInterval(() => {
      idleCountdown--;
    }, 1000);
    if (idleCountdown > 0) {
      return idleCountdown;
    }
  }
}
