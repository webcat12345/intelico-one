import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// Services
import { bgImages } from '../../../meta/bgImages-meta';
import { CommonService } from '@one-core/service/common.service';
import { BackgroundImg, PersonalSettings } from '../../../models/personalSettings.model';
import { IThemeUpload, PersonalSettingsService } from '../../../services/personal-settings.service';

@Component({
  selector: 'one-admin-widget-settings-theme-tab',
  templateUrl: './widget-settings-theme-tab.component.html',
  styleUrls: ['./widget-settings-theme-tab.component.scss']
})
export class WidgetSettingsThemeTabComponent implements OnInit, OnDestroy {

  @ViewChild('inputFile', {static: true}) inputFile: ElementRef;

  settings: PersonalSettings = new PersonalSettings();
  bgImages = bgImages;
  userId: string;
  checkEmptyData = true;
  themeFile: IThemeUpload = {entityType: 7, position: 0, entityId: ''};

  constructor(
    private commonService: CommonService,
    private personalSettingsService: PersonalSettingsService
  ) {
  }

  ngOnInit() {
    this.userId = this.commonService.userId;
    if (this.userId) {
      this.themeFile.entityId = this.userId;
      this.personalSettingsService.getPersonalThemes(this.userId)
        .subscribe(
          personalThemes => {
            if (personalThemes.data.length > 0) {
              personalThemes.data.map((item) => {
                this.bgImages.push({id: item.id, name: 'personalImage', url: item.fileUrl});
              });
            }
          }, err => console.error(err)
        );
    }
    this.settings = this.personalSettingsService.loadSettings();
  }

  ngOnDestroy(): void {
    this.bgImages.splice(12);
  }

  update(): void {
    this.personalSettingsService.saveSettings(this.settings);
  }

  onSelectImage(bg: BackgroundImg): void {
    this.settings.bgImg = bg;
  }

  deletePersonalImage(imageId: any) {
    this.personalSettingsService.deletePersonalTheme(imageId)
      .subscribe(
        resp => {
          if (resp === null) {
            if (this.userId) {
              this.personalSettingsService.getPersonalThemes(this.userId)
                .subscribe(
                  personalThemes => {
                    this.checkEmptyData = true;
                    if (personalThemes.data.length === 0) {
                      if (this.checkSelectImage()) {
                        this.setDefaultSettings();
                      } else {
                        this.bgImages.splice(12);
                      }
                    }
                    if (personalThemes.data.length > 0) {
                      this.bgImages.splice(12);
                      personalThemes.data.map((item) => {
                        this.bgImages.push({id: item.id, name: 'personalImage', url: item.fileUrl});
                      });
                      if (this.checkSelectImage()) {
                        this.setDefaultSettings();
                      }
                    }
                  }, err => console.error(err)
                );
            }
          }
        }, err => console.error(err)
      );
  }

  fileChange(event) {
    this.themeFile.files = event.target.files;
    this.personalSettingsService.uploadTheme(this.themeFile)
      .subscribe((personalImage) => {
        if (personalImage) {
          this.inputFile.nativeElement.value = '';
          personalImage.map((item) => {
            this.bgImages.push({id: item.id, name: 'personalImage', url: item.fileUrl});
          });
        }
      }, err => console.error(err));
  }

  private setDefaultSettings() {
    this.settings.bgImg = {id: 1, name: 'default', url: 'assets/bg_images/bg.jpg'};
    this.personalSettingsService.saveSettings(this.settings);
  }

  private checkSelectImage() {
    let checkEmptyData = true;
    this.bgImages.map((item) => {
      if (item.url === this.settings.bgImg.url) {
        checkEmptyData = false;
      }
    });
    return checkEmptyData;
  }
}
