import { Component, Input, OnInit } from '@angular/core';
import { LoaderType } from '@one-core/model';

@Component({
  selector: 'one-admin-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() size: string;
  @Input() whiteOverlay: boolean;
  @Input() type: LoaderType = LoaderType.Default;

  LoaderType = LoaderType;

  constructor() {
  }

  ngOnInit() {
  }

}
