export class Widget {
  public id: number; // identifier number
  public config: any; // grid config
  public state: string; // current window state max/min/normal
  public active: boolean; // current active state true/false
  public loading: boolean; // currently loading or not
  public type: string; // windows defined string
  public menuType: string;
  public title: string; // windows title
  public isAdd: boolean; // for admin sub windows only. default is false
  public data: any;
  public noMaxBtn?: boolean;

  constructor() {
    this.id = 0;
    this.config = [];
    this.state = 'normal';
    this.active = false;
    this.loading = false;
    this.type = '';
    this.menuType = '';
    this.title = ''; //
    this.isAdd = false;
    this.data = {};
    this.noMaxBtn = false;
  }
}
