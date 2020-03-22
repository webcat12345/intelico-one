import { Injectable } from '@angular/core';
import { Source } from '@one-core/model';
import * as FileSaver from 'file-saver';

export interface CameraStream {
  source: Source;
  image: string;
}

export interface GridModel {
  id: number;
  name: string;
  grid_btn_class: string;
  grid_wrapper_class: string;
  grid_count: number;
}

export interface GridFileFormat {
  cameras: Array<CameraStream>;
  currentGrid: GridModel;
}

export const viewerGrid: GridModel[] = [
  {
    id: 1,
    name: 'Grid 1x1',
    grid_btn_class: 'grid-btn1',
    grid_wrapper_class: 'grid1x1',
    grid_count: 1
  },
  {
    id: 2,
    name: 'Grid 2x1',
    grid_btn_class: 'grid-btn2',
    grid_wrapper_class: 'grid2x1',
    grid_count: 2
  },
  {
    id: 3,
    name: 'Grid 2x2',
    grid_btn_class: 'grid-btn3',
    grid_wrapper_class: 'grid2x2',
    grid_count: 4
  },
  /* {
     id: 4,
     name: 'Grid 3x3',
     grid_btn_class: 'grid-btn4',
     grid_wrapper_class: 'grid3x3',
     grid_count: 9
   },*/
  {
    id: 4,
    name: 'Grid 4x4',
    grid_btn_class: 'grid-btn4',
    grid_wrapper_class: 'grid4x4',
    grid_count: 16
  }
];

@Injectable()
export class WidgetViewerService {

  constructor() {
  }

  saveCurrentView(data: GridFileFormat) {
    const blob = new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, `camera-grid-${new Date().toISOString()}.txt`);
  }
}
