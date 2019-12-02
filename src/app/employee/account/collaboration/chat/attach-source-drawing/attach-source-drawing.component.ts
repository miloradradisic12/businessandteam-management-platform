import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AttachmentMessageModel } from 'app/collaboration/models';
import { vdCanvasService } from 'app/elements/vd-canvas/vd-canvas.service';
import { vdCanvasOptions } from 'app/elements/vd-canvas/vd-canvas.component';

@Component({
  selector: 'app-attach-source-drawing',
  templateUrl: './attach-source-drawing.component.html',
  styleUrls: ['./attach-source-drawing.component.scss'],
  viewProviders: [vdCanvasService]
})
export class AttachSourceDrawingComponent implements OnInit {

  sourceAttachment: AttachmentMessageModel;
  drawingAttachment: AttachmentMessageModel;
  sourceText: string;
  drawingText: string;
  dropZoneChartTemplate: string;
  
  @Output() selctedSourceAttachment = new EventEmitter<AttachmentMessageModel>();
  @Output() selectedDrawingAttachment = new EventEmitter<AttachmentMessageModel>();

  canvasOptions: vdCanvasOptions = {
    drawButtonEnabled: true,
    drawButtonClass: "drawButtonClass",
    drawButtonText: "Draw",
    clearButtonEnabled: true,
    clearButtonClass: "clearButtonClass",
    clearButtonText: "Clear",
    undoButtonText: "Undo",
    undoButtonEnabled: true,
    redoButtonText: "Redo",
    redoButtonEnabled: true,
    colorPickerEnabled: true,
    saveDataButtonEnabled: false,
    saveDataButtonText: "Save",
    strokeColor: "rgb(0,0,0)",
    shouldDownloadDrawing: false,
    canvasCurser:'auto'
  };

  constructor() { }

  ngOnInit() {
    this.sourceText = '';
    this.drawingText = '';
    this.sourceAttachment = new AttachmentMessageModel();
    this.drawingAttachment = new AttachmentMessageModel();
    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  }

  sourceFilesUpdated(files) {
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
    let filename = file.name
    // set icon on basis of fileType 
    fileReader.addEventListener('loadend', function (loadEvent: any) {
      self.sourceAttachment.file = loadEvent.target.result;
      self.sourceAttachment.msg = self.sourceText;
      self.sourceAttachment.type = fileType;
      self.sourceAttachment.title = filename;
      //self.selctedSourceAttachment.next(self.sourceAttachment);
      self.selctedSourceAttachment.emit(self.sourceAttachment);
    });

    fileReader.readAsDataURL(file);

  }

  drawingFilesUpdated(files) {
    debugger;
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
    let filename = file.name
    // set icon on basis of fileType 
    fileReader.addEventListener('loadend', function (loadEvent: any) {
      self.drawingAttachment.file = loadEvent.target.result;
      self.drawingAttachment.msg = self.drawingText;
      self.drawingAttachment.type = fileType;
      self.drawingAttachment.title = filename;
      //self.selectedDrawingAttachment.next(self.drawingAttachment);
      self.selectedDrawingAttachment.emit(self.drawingAttachment);
    });

    fileReader.readAsDataURL(file);

  }
  
  sendDrawing(){
    // console.log('my drawing');
    // console.log(this.drawingAttachment.file);
    this.selctedSourceAttachment.emit(this.drawingAttachment);
  }

  /*onSourceTextInputKeyPress(event: KeyboardEvent) {
    this.sourceAttachment.msg = this.sourceText;
    this.selctedSourceAttachment.emit(this.sourceAttachment);
  }

  onDrawingTextInputKeyPress(event: KeyboardEvent) {
    this.drawingAttachment.msg = this.drawingText;
    this.selectedDrawingAttachment.emit(this.drawingAttachment);
  }*/

  eventEmitSourceBlur(event: KeyboardEvent) {
    this.sourceAttachment.msg = this.sourceText;
    this.selctedSourceAttachment.emit(this.sourceAttachment);
  }

  eventEmitDrawingBlur(event: KeyboardEvent) {
    this.drawingAttachment.msg = this.drawingText;
    this.selectedDrawingAttachment.emit(this.drawingAttachment);
  }

}
