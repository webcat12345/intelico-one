import { Component, OnDestroy, OnInit } from '@angular/core';
import { groupBy, map, mergeMap, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { EventHub, Source } from '@one-core/model';
import { CommonService } from '@one-core/service/common.service';
import { SourceService } from '@one-core/service/source.service';
import { ToastrService } from '../../services/toastr.service';
import { CameraStream, GridFileFormat, GridModel, viewerGrid, WidgetViewerService } from './widget-viewer.service';
import { HubService } from '@one-core/service/hub.service';
import { HubConnectionType } from '../../../core/utils/hub.util';

@Component({
  selector: 'one-admin-widget-viewer',
  templateUrl: './widget-viewer.component.html',
  styleUrls: ['./widget-viewer.component.scss']
})
export class WidgetViewerComponent implements OnInit, OnDestroy {

  ViewerGrid: GridModel[] = viewerGrid;
  currentView: GridModel = viewerGrid[2]; // default view is 2X2
  cameras: Array<CameraStream> = [];
  cameraBySite: Array<Array<Source>> = [];
  isSourceLoading = false;

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private commonService: CommonService,
    private sourceService: SourceService,
    private toastr: ToastrService,
    private viwerService: WidgetViewerService,
    private hubService: HubService
  ) {
  }

  ngOnInit(): void {
    this.changeCameraView(viewerGrid[2]); // default view is 2X2
    this.getSources();
    this.checkHubData();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  async getSources(): Promise<void> {
    try {
      this.isSourceLoading = true;
      this.sourceService.getVideoCameras().pipe(
        map((x: any) => x.data),
        switchMap(data => from(data)),
        groupBy((source: any) => source.zone.parentId),
        mergeMap(source => source.pipe(toArray())),
      ).subscribe(res => {
        this.cameraBySite.push(res);
      });
    } catch (e) {
      this.toastr.warning('Sorry, Failed to get cameras. Please try again later.');
    } finally {
      this.isSourceLoading = false;
    }
  }

  checkHubData(): void {
    this.hubService.getHubStreamByType(HubConnectionType.History).pipe(
      takeUntil(this.unsubscribeAll),
      tap((data: EventHub) => {
        this.cameras.forEach(x => {
          if (x.source && x.source.id) {
            if (x.source.id === data.sourceDetails.id) {
              x.image = data.pictureUrl;
            }
          }
        });
      })
    ).subscribe();
  }

  onDrop(e, zoneNumber): void {
    this.cameras[zoneNumber].source = e.dragData;
  }

  changeCameraView(grid: GridModel): void {
    this.currentView = grid;
    const attachedStreams = this.cameras.filter(x => x.source);
    this.cameras = new Array<CameraStream>(this.currentView.grid_count);
    for (let i = 0; i < this.currentView.grid_count; i++) {
      this.cameras[i] = {source: null, image: null};
    }
    if (attachedStreams && attachedStreams.length) {
      attachedStreams.forEach((x, i) => {
        if (i < this.currentView.grid_count) {
          this.cameras[i] = x;
        }
      });
    }
  }

  closeCamera(camera: CameraStream): void {
    camera.image = '';
    camera.source = null;
  }

  saveCurrentView(): void {
    const data: GridFileFormat = {currentGrid: this.currentView, cameras: this.cameras};
    this.viwerService.saveCurrentView(data);
  }

  openSavedView(files: FileList): void {
    const file = files.item(0);
    if (!file) {
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const text: any = reader.result;
        const data = JSON.parse(text);
        this.cameras = data.cameras;
        this.currentView = data.currentGrid;
      };
      reader.readAsText(file);
    } catch (e) {
      this.toastr.warning('This setting file is invalid. Failed to restore the view. Please try again with different file');
    }
  }
}
