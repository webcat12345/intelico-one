import { ComponentFactoryResolver, DoCheck, ElementRef, EventEmitter, KeyValueDiffers, OnDestroy, OnInit, Renderer, ViewContainerRef } from '@angular/core';
import { NgGridConfig, NgGridItemEvent, NgGridItemPosition, NgGridItemSize } from '../interfaces/INgGrid';
import { NgGridItem } from './NgGridItem';

export declare class NgGrid implements OnInit, DoCheck, OnDestroy {
  private static CONST_DEFAULT_CONFIG;
  onDragStart: EventEmitter<NgGridItem>;
  onDrag: EventEmitter<NgGridItem>;
  onDragStop: EventEmitter<NgGridItem>;
  onResizeStart: EventEmitter<NgGridItem>;
  onResize: EventEmitter<NgGridItem>;
  onResizeStop: EventEmitter<NgGridItem>;
  onItemChange: EventEmitter<Array<NgGridItemEvent>>;
  colWidth: number;
  rowHeight: number;
  minCols: number;
  minRows: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  isDragging: boolean;
  isResizing: boolean;
  autoStyle: boolean;
  resizeEnable: boolean;
  dragEnable: boolean;
  cascade: string;
  minWidth: number;
  minHeight: number;
  config: NgGridConfig;
  private _differs;
  private _ngEl;
  private _renderer;
  private componentFactoryResolver;
  private _containerRef;
  private _items;
  private _draggingItem;
  private _resizingItem;
  private _resizeDirection;
  private _itemGrid;
  private _containerWidth;
  private _containerHeight;
  private _maxCols;
  private _maxRows;
  private _visibleCols;
  private _visibleRows;
  private _setWidth;
  private _setHeight;
  private _posOffset;
  private _adding;
  private _placeholderRef;
  private _fixToGrid;
  private _autoResize;
  private _differ;
  private _destroyed;
  private _maintainRatio;
  private _aspectRatio;
  private _preferNew;
  private _zoomOnDrag;
  private _limitToScreen;
  private _curMaxRow;
  private _curMaxCol;
  private _dragReady;
  private _resizeReady;
  private _config;

  constructor(_differs: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver, _containerRef: ViewContainerRef);

  ngOnInit(): void;

  ngOnDestroy(): void;

  setConfig(config: NgGridConfig): void;

  getItemPosition(index: number): NgGridItemPosition;

  getItemSize(index: number): NgGridItemSize;

  ngDoCheck(): boolean;

  setMargins(margins: Array<string>): void;

  enableDrag(): void;

  disableDrag(): void;

  enableResize(): void;

  disableResize(): void;

  addItem(ngItem: NgGridItem): void;

  removeItem(ngItem: NgGridItem): void;

  updateItem(ngItem: NgGridItem): void;

  triggerCascade(): void;

  resizeEventHandler(e: any): void;

  mouseDownEventHandler(e: MouseEvent): boolean;

  mouseUpEventHandler(e: any): boolean;

  mouseMoveEventHandler(e: any): void;

  private _calculateColWidth();

  private _calculateRowHeight();

  private _updateRatio();

  private _updateLimit();

  private _applyChanges(changes);

  private _resizeStart(e);

  private _dragStart(e);

  private _zoomOut();

  private _resetZoom();

  private _drag(e);

  private _resize(e);

  private _dragStop(e);

  private _resizeStop(e);

  private _maxGridSize(w, h);

  private _calculateGridSize(width, height);

  private _calculateGridPosition(left, top);

  private _hasGridCollision(pos, dims);

  private _getCollisions(pos, dims);

  private _fixGridCollisions(pos, dims, shouldSave?);

  private _limitGrid(maxCols);

  private _cascadeGrid(pos?, dims?, shouldSave?);

  private _fixGridPosition(pos, dims);

  private _isWithinBoundsX(pos, dims);

  private _isWithinBoundsY(pos, dims);

  private _isWithinBounds(pos, dims);

  private _addToGrid(item);

  private _removeFromGrid(item);

  private _updateSize(col?, row?);

  private _getMaxRow();

  private _getMaxCol();

  private _getMousePosition(e);

  private _getAbsoluteMousePosition(e);

  private _getContainerColumns();

  private _getItemFromPosition(position);

  private _createPlaceholder(item);

  private _emitOnItemChange();
}
