import {AfterViewInit, Component, EventEmitter, forwardRef, Output, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import Quill from 'quill';


/**
 * Text editor component for text editing
 * Based on quilljs https://quilljs.com/
 *
 * @output forceSave - event, triggers when something changed
 *
 * Usage:
 *
 *  <app-text-editor [(ngModel)]="content"
 *                   (forceSave)="onForceSave()"
 *  ></app-text-editor>
 **/
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextEditorComponent),
    multi: true
  }],
})
export class TextEditorComponent implements AfterViewInit, ControlValueAccessor {
  @Input() readOnly :boolean = false;
  @Output() forceSave = new EventEmitter();

  editorId: string;
  editor: any;
  content: any;

  toolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']                         // link and image, video
  ];

  constructor() {
    this.editorId = 'quill-editor-' + Math.floor(Math.random() * 100000);
  }

  ngAfterViewInit(): void {
    this.editor = new Quill(`#${this.editorId}`, {
      modules: {
        toolbar: this.toolbar
      },
      theme: 'snow'
    });

    this.editor.on('text-change', () => {
      this.content = this.editor.root.innerHTML;
      this.onModelChange(this.editor.root.innerHTML);
      this.forceSave.emit();
    });

    if (this.content) {
      this.editor.pasteHTML(this.content);
    }

    this.editor.enable(!this.readOnly);
  }

  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};

  writeValue(currentValue: any) {
    this.content = currentValue;
    if (this.editor) {
      if (currentValue) {
        this.editor.pasteHTML(currentValue);
        return;
      }
      this.editor.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}
