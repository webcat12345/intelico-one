export class BackgroundImg {
  id: number;
  name: string;
  url: string;

  constructor() {
    this.id = 1;
    this.name = 'default';
    this.url = 'assets/bg_images/bg.jpg';
  }
}

export class PersonalSettings {
  menuPosition: string;
  bgImg: BackgroundImg;

  constructor() {
    this.menuPosition = 'left';
    this.bgImg = new BackgroundImg();
  }
}
