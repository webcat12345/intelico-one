import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Howl } from 'howler';
import { Widget } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  associationStore$: EventEmitter<any> = new EventEmitter();
  triggerEvent$: EventEmitter<any> = new EventEmitter<any>();
  resetIdleChecker$: EventEmitter<any> = new EventEmitter<any>();
  private addNewBoxSubject = new Subject<string>();
  addNewBoxSubject$ = this.addNewBoxSubject.asObservable();
  private boxChangeStateSubject = new Subject<number>();
  boxChangeStateSubject$ = this.boxChangeStateSubject.asObservable();
  private boxCloseEventSubject = new Subject<{ box_index: number, box: Widget }>();
  boxCloseEventSubject$ = this.boxCloseEventSubject.asObservable();
  private toggleAlertQueSubject = new Subject<any>();
  toggleAlertQueSubject$ = this.toggleAlertQueSubject.asObservable();
  private openAdminSubWindowSubject = new Subject<any>();
  openAdminSubWindowSubject$ = this.openAdminSubWindowSubject.asObservable();
  private audioMuted = false;

  constructor() {
  }

  playSound(name) {
    if (!this.audioMuted) {
      const sound = new Howl({
        src: [environment.sounds.root + name]
      });
      sound.play();
    }
  }

  muteAudio(flag: boolean): void {
    this.audioMuted = flag;
  }

  confirmAddNewBox(type: any): void {
    this.addNewBoxSubject.next(type);
  }

  boxStateChange(box_index): void {
    this.boxChangeStateSubject.next(box_index);
  }

  boxCloseEvent(box_index, box: Widget): void {
    this.boxCloseEventSubject.next({box_index, box});
  }

  toggleAlertQue(): void {
    this.toggleAlertQueSubject.next(true);
  }

  getWindowInfoByType(window_type: string, windows: Widget[]): number {
    for (let i = 0; i < windows.length; i++) {
      if (windows[i].type === window_type) {
        return i;
      }
    }
    return -1;
  }

  openAdminSubWindow(windowType, isAdd = false, data: any = null): void {
    this.openAdminSubWindowSubject.next({windowType, isAdd, data});
  }

  setAssocationStore(data, target) {
    this.associationStore$.emit({res: data, target});
  }

  resetIdleChecker() {
    this.resetIdleChecker$.emit();
  }
}
