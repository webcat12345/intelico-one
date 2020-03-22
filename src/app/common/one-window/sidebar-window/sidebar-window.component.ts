import { Component, ElementRef, EventEmitter, HostListener, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { UserRole } from '../../../core/models/authentication';

export enum SidebarType {
  Default = 0,
  HasOverlaySidebar,
  StaticSidebar
}

export interface SidebarOption {
  type: SidebarType;
  classes?: string;
}

@Component({
  selector: 'one-admin-sidebar-window',
  templateUrl: './sidebar-window.component.html',
  styleUrls: ['./sidebar-window.component.scss']
})
export class SidebarWindowComponent {

  @Input() sidebarTemplateRef: TemplateRef<any>;
  @Input() overlaySidebarTemplateRef: TemplateRef<any>;
  @Input() headerTemplateRef: TemplateRef<any>;
  @Input() tableTemplateRef: TemplateRef<any>;
  @Input() normalTemplateRef: TemplateRef<any>;
  @Input() hideSidebarButton = false;
  @Input() sidebarOption: SidebarOption = {
    type: SidebarType.Default
  };
  @Input() notificationTemplateRef: TemplateRef<any>;

  @Output() toggleOverlaySidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('defaultSidebarRef', {static: true}) defaultSidebarRef;
  @ViewChild('overlaySidebarRef', {static: true}) overlaySidebarRef;
  @ViewChild('sidebarRef', {static: true}) sidebarRef: ElementRef;

  isSidebarOpened = false;
  isOverlaySidebarOpened = false;
  isConfirmModalOpened = false;
  isImageModalOpened = false;
  isDetailModalOpened = false;

  imageModalSrc = '';
  detailData: any = null;

  SidebarType = SidebarType;
  UserRole = UserRole;
  metaDataKeys: Array<string> = [];
  metaDataValues: Array<string> = [];

  constructor(
    private library: FaIconLibrary
  ) {
    this.library.addIcons(faFilter);
  }

  openOverlaySidebar(): void {
    this.isOverlaySidebarOpened = !this.isOverlaySidebarOpened;
    this.toggleOverlaySidebar.emit();
  }

  sidebarOpened(): void {
    this.isSidebarOpened = !this.isSidebarOpened;
    this.toggleOverlaySidebar.emit(this.isSidebarOpened);
    if (this.isSidebarOpened) {
      this.hideSidebarButton = true;
    }
  }

  openImageModal(src): void {
    this.imageModalSrc = src;
    this.isImageModalOpened = true;
  }

  openDetailModal(data): void {
    if (data.metaData) {
      this.metaDataValues = Object.values(data.metaData);
      this.metaDataKeys = Object.keys(data.metaData);
    }
    this.detailData = data;
    this.isDetailModalOpened = true;
  }

  deleteConfirm(): void {
    this.isConfirmModalOpened = true;
  }

  onDelete(flag: boolean): void {
    this.isConfirmModalOpened = false;
    this.delete.emit(flag);
  }

  closeSidebar(): void {
    this.hideSidebarButton = false;
    this.isSidebarOpened = false;
  }

  scrollToBottomSidebar(): void {
    // HOTFIX: wait for element bind
    setTimeout(() => {
      if (this.sidebarRef) {
        this.sidebarRef.nativeElement.scrollTop = this.sidebarRef.nativeElement.scrollHeight;
      }
    }, 100);
  }

  @HostListener('document:keydown.tab', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (!this.isSidebarOpened && !this.isOverlaySidebarOpened) {
      event.preventDefault();
    }
  }

}
