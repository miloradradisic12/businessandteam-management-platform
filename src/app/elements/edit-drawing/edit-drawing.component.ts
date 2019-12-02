import {AfterViewInit, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

declare const require: any;
const mx = require('mxgraph')({
  mxImageBasePath: 'assets/img',
  mxBasePath: 'assets',
  mxLoadResources: false
});


/**
 * Edit Drawing component for creating and drawing diagrams.
 *
 * @input enabled - sets ability to change giagram, default true
 * @output forceSave - event triggers for force saving of diagram
 *
 * Usage:
 * <app-edit-drawing [enabled]="enabled"
 *                   [(ngModel)]="answer.drawing"
 *                   (forceSave)="onForceSave()"></app-edit-drawing>
 */
@Component({
  selector: 'app-edit-drawing',
  templateUrl: './edit-drawing.component.html',
  styleUrls: [
    './edit-drawing.component.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditDrawingComponent),
      multi: true
    }
  ]
})
export class EditDrawingComponent implements AfterViewInit, ControlValueAccessor {
  @Input() enabled = true;
  @Output() forceSave = new EventEmitter();

  editorId: string;
  toolbarPosition = {
    x: 0,
    y: 0
  };
  activeTool: any;
  zoom = [
    {display: '10%', delta: 0.1},
    {display: '25%', delta: 0.25},
    {display: '33%', delta: 0.33},
    {display: '50%', delta: 0.5},
    {display: '75%', delta: 0.75},
    {display: '100%', delta: 1},
    {display: '125%', delta: 1.25},
    {display: '150%', delta: 1.5},
    {display: '200%', delta: 2},
  ];
  zoomIndex = 5;

  // For figures panel
  isPanelVisible = false;
  isFiguresVisible = false;

  figures = [
    {
      type: 'square',
      img: '/assets/img/box_tool.png',
      width: 80,
      height: 80,
      style: 'shape=rectangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'circle',
      img: '/assets/img/circle_tool.png',
      width: 80,
      height: 80,
      style: 'shape=ellipse;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'ellipse',
      img: '/assets/img/ellipse_tool.png',
      width: 80,
      height: 50,
      style: 'shape=ellipse;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'triangle',
      img: '/assets/img/triangle_tool.png',
      width: 80,
      height: 80,
      style: 'shape=triangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'rectangle',
      img: '/assets/img/rectangle_tool.png',
      width: 80,
      height: 50,
      style: 'shape=rectangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'rounded-rectangle',
      img: '/assets/img/rounded_tool.png',
      width: 80,
      height: 50,
      style: 'shape=rectangle;rounded=1;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'hexagon',
      img: '/assets/img/polygon_tool.png',
      width: 80,
      height: 70,
      style: 'shape=hexagon;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }, {
      type: 'line',
      img: '/assets/img/str_line_tool.png',
      width: 50,
      height: 1,
      style: 'shape=line;endArrow=open;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center'
    }
  ];

  diagram: any;
  undoManager: any;

  editedStyle = {};

  constructor () {
    this.editorId = 'mx-editor-' + Math.floor(Math.random() * 100000);
    // Changes some default colors
    mx.mxConstants.HANDLE_FILLCOLOR = '#99ccff';
    mx.mxConstants.HANDLE_STROKECOLOR = '#0088cf';
    mx.mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
    mx.mxConstants.OUTLINE_COLOR = '#00a8ff';
    mx.mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff';
    mx.mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff';
    mx.mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
    mx.mxConstants.EDGE_SELECTION_COLOR = '#00a8ff';
    mx.mxConstants.DEFAULT_VALID_COLOR = '#00a8ff';
    mx.mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff';
    mx.mxConstants.GUIDE_COLOR = '#0088cf';
    mx.mxConstants.HIGHLIGHT_OPACITY = 30;
    mx.mxConstants.HIGHLIGHT_SIZE = 8;
    mx.mxConstants.STYLE_ALIGN = mx.mxConstants.ALIGN_RIGHT;
  }

  writeValue(value: string) {
    if (value) {
      const parent = this.diagram.getDefaultParent();
      this.diagram.getModel().beginUpdate();

      const doc = mx.mxUtils.parseXml(value);
      const decoder = new mx.mxCodec(doc);
      const model = decoder.decode(doc.documentElement);

      this.diagram.getModel().mergeChildren(model.getRoot().getChildAt(0), parent);

      // hack to update diagram
      const v = this.diagram.insertVertex(this.diagram.getDefaultParent(), null, '', 0, 0, 0, 0);
      this.diagram.removeCells([v]);

      this.diagram.getModel().endUpdate();
    }
  }

  ngAfterViewInit() {
    const self = this;
    const connectorSrc = '/assets/img/transparent.jpg';
    this.diagram = new mx.mxGraph(document.getElementById(this.editorId));

    this.diagram.setEnabled(this.enabled);

    const rubberband = new mx.mxRubberband(this.diagram);
    this.undoManager = new mx.mxUndoManager();

    const listener = function(sender, evt) {
      self.undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    this.diagram.getModel().addListener(mx.mxEvent.UNDO, listener);
    this.diagram.getView().addListener(mx.mxEvent.UNDO, listener);

    // Enables rotation handle
    mx.mxVertexHandler.prototype.rotationEnabled = true;

    // Enables guides
    mx.mxGraphHandler.prototype.guidesEnabled = true;

    // Enables snapping waypoints to terminals
    mx.mxEdgeHandler.prototype.snapToTerminals = true;

    // Disable default context menu
    mx.mxEvent.disableContextMenu(document.getElementById(this.editorId));

    // Larger tolerance and grid for real touch devices
    if (mx.mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
      mx.mxShape.prototype.svgStrokeTolerance = 18;
      mx.mxVertexHandler.prototype.tolerance = 12;
      mx.mxEdgeHandler.prototype.tolerance = 12;
      mx.mxGraph.prototype.tolerance = 12;
      mx.mxConstants.HANDLE_SIZE = 12;
      mx.mxConstants.LABEL_HANDLE_SIZE = 7;
    }

    // One finger pans (no rubberband selection) must start regardless of mouse button
    mx.mxPanningHandler.prototype.isPanningTrigger = function(me) {
      const evt = me.getEvent();

      return (me.getState() == null && !mx.mxEvent.isMouseEvent(evt)) ||
        (mx.mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
        mx.mxEvent.isControlDown(evt) || mx.mxEvent.isShiftDown(evt)));
    };

    /*
      Enables connections in the graph and disables
      reset of zoom and translate on root change
      (ie. switch between XML and graphical mode).
    */
    // this.diagram.setConnectable(true);
    this.diagram.centerZoom = true;
    this.diagram.setPanning(true);

    this.diagram.popupMenuHandler.factoryMethod = function(menu, cell) {
      if (cell && cell.isVertex) {
        menu.addItem('Delete', null, function() {
          self.diagram.removeCells([cell]);
          self.onChange(self.getXML());
          self.forceSave.emit();
        });
      }
    };

    this.diagram.addListener(mx.mxEvent.CELLS_MOVED, () => {this.onChange(this.getXML()); this.forceSave.emit(); });
    this.diagram.addListener(mx.mxEvent.CELL_CONNECTED, () => {this.onChange(this.getXML()); this.forceSave.emit(); });
    this.diagram.addListener(mx.mxEvent.CELLS_RESIZED, () => {this.onChange(this.getXML()); this.forceSave.emit(); });

    this.diagram.addListener(mx.mxEvent.DOUBLE_CLICK, function (node, event) {
      // Check if we made double click on figure
      if (event.properties.hasOwnProperty('cell')) {
        self.activeTool = 'font';
      } else {
        const x = event.properties.event.layerX / self.diagram.view.scale;
        const y = event.properties.event.layerY / self.diagram.view.scale;

        self.drawText(x, y);
      }
    });

    this.diagram.addListener(mx.mxEvent.CLICK, function (graph, event) {
      /*
        Detect if it is left button
        https://www.w3schools.com/jsref/event_button.asp
      */
      const leftButton = event.properties.event.button === 0;

      // Check if we made left click on figure
      if (event.properties.hasOwnProperty('cell') && leftButton && event.properties.cell.vertex) {
        const edited_cell = event.properties.cell;

        self.editedStyle = self.parseFigureStyle(edited_cell.style);

        self.openToolbar(edited_cell);

        // Do not open toolbar on images
        if (self.editedStyle.hasOwnProperty('shape') && self.editedStyle['shape'] !== 'image') {
          self.activeTool = 'figure';
        }
      } else {
        self.activeTool = null;
        self.editedStyle = {};
      }
    });

    this.diagram.addListener(mx.mxEvent.TAP_AND_HOLD, function(sender, evt) {
      if (!mx.mxEvent.isMultiTouchEvent(evt)) {
        const me = evt.getProperty('event');
        const cell = evt.getProperty('cell');

        if (cell == null) {
          const pt = mx.mxUtils.convertPoint(this.container,
            mx.mxEvent.getClientX(me), mx.mxEvent.getClientY(me));
          rubberband.start(pt.x, pt.y);
        } else if (this.diagram.getSelectionCount() > 1 && this.diagram.isCellSelected(cell)) {
          this.diagram.removeSelectionCell(cell);
        }

        // Blocks further processing of the event
        evt.consume();
      }
    });
  }

  openToolbar(cell) {
    const geo = cell.geometry;
    const scale = this.diagram.view.scale;

    this.toolbarPosition = {
      x: geo.x * scale - this.diagram.container.scrollLeft,
      y: geo.y * scale - this.diagram.container.scrollTop + geo.height * scale + 15
    };
  }

  /**
   * Method for parsing string style to object
   *
   * @param style - figure style srting
   * @return parsed object
   */
  parseFigureStyle (style: string): Object {
    const styleObj = {};

    if (style) {
      style.split(';').forEach((current) => {
        const arr = current.split('=');
        styleObj[arr[0]] = arr[1] || null;
      });
    }

    return styleObj;
  }

  /**
   * Method for creating style string from object
   *
   * @param styleObj - figure style object
   * @return style string
   */
  stringifyFigureStyle (styleObj: Object): string {
    let style = '';
    for (const key in styleObj) {
      style += styleObj[key] ? `${key}=${styleObj[key]};` : `${key};`;
    }
    return style;
  }

  getInsertPoint = function() {
    const gs = this.diagram.getGridSize();
    const dx = this.diagram.container.scrollLeft / this.diagram.view.scale - this.diagram.view.translate.x;
    const dy = this.diagram.container.scrollTop / this.diagram.view.scale - this.diagram.view.translate.y;

    return new mx.mxPoint(this.diagram.snap(dx + gs), this.diagram.snap(dy + gs));
  };

  getFreeInsertPoint = function() {
    const view = this.diagram.view;
    const bds = this.diagram.getGraphBounds();
    const pt = this.getInsertPoint();

    // Places at same x-coord and 2 grid sizes below existing graph
    const x = this.diagram.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
      ((bds.width === 0) ? this.diagram.gridSize : 0))));
    const y = this.diagram.snap(Math.round(Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y +
      ((bds.height === 0) ? 1 : 2) * this.diagram.gridSize)));

    return new mx.mxPoint(x, y);
  };

  /**
   * Method for drawing figure on diagram
   *
   * @param figureType: figure type
   **/
  drawFigure(figureType) {
    console.log(`draw figure`);
    this.isFiguresVisible = false;
    this.diagram.getModel().beginUpdate();

    var ch = this.diagram.container.clientHeight;
    const figure = this.figures.filter((item) => item.type === figureType )[0];
    this.diagram.insertVertex(this.diagram.getDefaultParent(), null, '', ch/2, ch/2, figure.width, figure.height, figure.style);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Method for drawing text on diagram
   *
   * @param x: x coordinate for inserting, default is null and get calculated as per center of the screen
   * @param y: y coordinate for inserting, default is null and get calculated as per center of the screen
   **/
  drawText(x = null, y = null) {
    this.isPanelVisible = false;

    //var bounds = this.diagram.getGraphBounds();
    if(x==null){
      var cw = this.diagram.container.clientWidth;
      x = cw/2;
    }
    if(y==null){
      var ch = this.diagram.container.clientHeight;
      y = ch/2;
    }   
    
    this.diagram.getModel().beginUpdate();  

    const text = this.diagram.insertVertex(this.diagram.getDefaultParent(), null, 'Text', x, y, 80, 30,
      'strokeColor=transparent;fillColor=transparent;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center;autosize=1');
    this.diagram.updateCellSize(text);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Method for drawing edge on diagram
   **/
  drawEdge() {
    console.log(`draw edge`);
    this.isPanelVisible = false;
    this.diagram.getModel().beginUpdate();

    const cell = new mx.mxCell('', new mx.mxGeometry(10, 10, 50, 50), 'edgeStyle=segmentEdgeStyle;curved=0;dashed=0;html=1');

    var cw = this.diagram.container.clientWidth;
    var ch = this.diagram.container.clientHeight;

    cell.geometry.setTerminalPoint(new mx.mxPoint(ch/2, ch/2), true);
    cell.geometry.setTerminalPoint(new mx.mxPoint(ch/2 + 60, ch/2), false);
    cell.geometry.relative = true;
    cell.edge = true;

    this.diagram.getDefaultParent().insert(cell, true);

    // hack to update diagram
    const v = this.diagram.insertVertex(this.diagram.getDefaultParent(), null, '', 0, 0, 0, 0);
    this.diagram.removeCells([v]);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Callback called changing style of edited figure
   * Updates figure style
   *
   * @param style: Object of changed style
   */
  onStyleChanged(style) {
    console.log(`on style changed`);
    console.log(style);

    this.editedStyle = style;

    this.diagram.getModel().setStyle(
      this.diagram.getSelectionCell(),
      this.stringifyFigureStyle(style)
    );

    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Method for getting diagram xml
   *
   * @return xml of diagram
   **/
  getXML () {
    const enc = new mx.mxCodec();
    const node = enc.encode(this.diagram.getModel());
    const xml = mx.mxUtils.getXml(node);
    return xml;
  }

  /**
   * Callback called after file was choosing
   * Insert image in diagram
   *
   * @param file: file that was chosen;
   */
  onFileChosen(file) {
    const self = this;
    const image = new Image();
    const fileReader: FileReader = new FileReader();

    fileReader.addEventListener('loadend', (loadEvent: any) => {
      image.src = loadEvent.target.result;

      image.addEventListener('load', () => {
        self.diagram.getModel().beginUpdate();
        /*
          Removing ';base64' from base64 string is from documentation
          https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxConstants-js.html
          Find STYLE_IMAGE constant
        */
        self.diagram.insertVertex(self.diagram.getDefaultParent(), null, '', 10, 10, image.width, image.height,
          `shape=image;image=${image.src.replace(';base64', '')};fillColor=transparent;strokeColor=transparent;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center`
        );
        self.diagram.getModel().endUpdate();
        self.onChange(self.getXML());
      });
    });

    fileReader.readAsDataURL(file);
  }

  /**
   * Method that draws image on
   *
   * @param event: event from hidden file input
   */
  drawImage(event) {
    if (event.target.files.length) {
      this.onFileChosen(event.target.files[0]);
    }

    this.isPanelVisible = false;
  }

  /**
   * Method for zooming in diagram
   */
  zoomIn() {
    this.activeTool = null;
    if (this.zoomIndex + 1 <= this.zoom.length - 1) {
      this.zoomIndex += 1;
      this.diagram.zoomTo(this.zoom[this.zoomIndex].delta);
    }
  }

  /**
   * Method for zooming out diagram
   */
  zoomOut() {
    this.activeTool = null;
    if (this.zoomIndex > 0) {
      this.zoomIndex -= 1;
      this.diagram.zoomTo(this.zoom[this.zoomIndex].delta);
    }
  }

  /**
   * Method for undo changes
   */
  undo() {
    this.activeTool = null;
    if (this.undoManager.canUndo()) {
      this.undoManager.undo();
    }
  }

  /**
   * Method for redo changes
   */
  redo() {
    this.activeTool = null;
    if (this.undoManager.canRedo()) {
      this.undoManager.redo();
    }
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
