import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import FormDataPolyfill from 'formdata-polyfill/formdata.min';
import * as mammoth from 'mammoth';

import DocumentModel from 'app/core/models/DocumentModel';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {DocumentsService} from 'app/projects/documents.service';
import {TasksService} from 'app/projects/tasks.service';

import {DocumentItem} from '../document-explorer/DocumentItem';
import {ProcessItem} from '../document-explorer/ProcessItem';


@Component({
  template: `
    <div *ngIf="documentItem" class="document-container">
      <div [ngSwitch]="document.doc_type" class="document-element">
        <div *ngSwitchCase="'document'" class="document">
          <app-text-editor [(ngModel)]="content" (forceSave)="onForceSave()"></app-text-editor>
        </div>

        <div *ngSwitchCase="'diagram'" class="document diagram">
          <div class="diagram-container">
            <app-edit-drawing [(ngModel)]="content" (forceSave)="onForceSave()"></app-edit-drawing>
          </div>
        </div>

        <div *ngSwitchCase="'spreadsheet'" class="document">
           <app-spreadsheet [(ngModel)]="content"  (forceSave)="onForceSave()"></app-spreadsheet>
        </div>

        <div *ngSwitchCase="'drawing'" class="document">
          <div class="diagram-container">
            <app-edit-drawing [(ngModel)]="content" (forceSave)="onForceSave()"></app-edit-drawing>
          </div>
        </div>

        <div *ngSwitchCase="'ocr'" class="document">
          <div class="diagram-container">
            <app-ocr-input [(ngModel)]="content" (forceSave)="onForceSave()" [isWorkArea]="true"></app-ocr-input>
          </div>
        </div>

        <div *ngSwitchCase="'presentation'" class="document">
          <app-presentation-input [(ngModel)]="content" (forceSave)="onForceSave()"></app-presentation-input>
          <!--<app-presentation-input></app-presentation-input>-->
        </div>

      </div>
    </div>
  `,
  styles: [`
    .document-container {
      height: calc(100% - 39px);
    }
    
    .document-element {
      height: 100%;
      border-top: 1px solid transparent;
    }
    
    .document {
      height: 100%;
      overflow: auto;
    }
    
    .diagram-container {
      margin: 24px;
      background-color: #fff;
      height: calc(100% - 48px);
      overflow: auto;
      padding: 15px;
    }
    
    .document.diagram {
      border-top: 1px solid transparent;
    }
    
    @media only screen and (max-width: 600px) {
      .diagram-container {
        margin: 15px;
        background-color: #fff;
        height: calc(100% - 30px);
      }
    }
  `]
})
export class CollaborationDocumentComponent implements OnInit {
  documentItem: DocumentItem;
  document: DocumentModel;
  content = null;
  isSaving: boolean;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private tasksService: TasksService,
    private folderNavigation: FolderNavigation,
  ) {
    this.document = new DocumentModel();
    this.documentItem = null;
    this.isSaving = false;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const documentId = params['documentId'];

      if (documentId === 'new') {
        this.document = {
          id: null,
          name: 'New Document',
          doc_type: params['type'],
          task: params['process']
        } as DocumentModel;
        this.documentItem = new DocumentItem(this.document);
        this.tasksService.get(this.document.task).subscribe((task) => {
          this.documentItem.parent = new ProcessItem(task);
          this.folderNavigation.addItem(this.documentItem);
          this.folderNavigation.opened.emit(this.documentItem);
        });
      } else {
        this.getDocument(documentId);
      }
    });
  }

  getDocument(id: number) {
    this.documentsService.get(id).flatMap((document: DocumentModel) => {
      this.document = document;

      this.documentsService.getDocument(this.document['document'])
        .subscribe((blob: Blob) => {
          this.parseDocument(blob);
        });
      this.documentItem = new DocumentItem(document);
      return this.tasksService.get(document.task);
    }).subscribe((task) => {
      this.documentItem.parent = new ProcessItem(task);
      this.folderNavigation.addItem(this.documentItem);
      this.folderNavigation.opened.emit(this.documentItem);
    });
  }

  parseDocument(blob: Blob) {
    const fileReader = new FileReader();
    if (this.document['ext'] === 'docx') {
      fileReader.readAsArrayBuffer(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        mammoth['convertToHtml']({arrayBuffer: event.target['result']})
          .then((result) => {
            this.content = result.value;
            this.document['ext'] = 'html';
          })
          .catch((error) => {
            console.log(error);
          });
      };
    } else if (this.document['ext'] === 'xlsx') {
      fileReader.readAsArrayBuffer(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          this.content = event.target['result'];
        }
      };
    } else {
      fileReader.readAsText(blob);

      fileReader.onloadend = (event: ProgressEvent) => {
        this.content = event.target['result'];
      };
    }
  }

  base64ToArrayBuffer(base64) {
    const binary_string =  window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onForceSave() {
    if (this.document.id) {
      this.updateDocument();
    } else {
      this.createDocument();
    }
  }

  getFormData(): FormDataPolyfill {
    let file: File;
    let content = this.content;

    if (this.document.doc_type === 'document') {
      this.document['ext'] = 'html';
    } else if (this.document.doc_type === 'diagram') {
      this.document['ext'] = 'xml';
    } else if (this.document.doc_type === 'spreadsheet') {
      const arrayBuffer = this.base64ToArrayBuffer(this.content);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      content = new Blob([arrayBuffer], {type : fileType});
      this.document['ext'] = 'xlsx';
    } else if (this.document.doc_type === 'ocr') {
      this.document['ext'] = 'txt';
    } else if (this.document.doc_type === 'presentation') {
      this.document['ext'] = 'html';
    }

    file = new File([content], `${this.document.name}.${this.document['ext']}`);
    this.document['document'] = file;
    const formData = new FormDataPolyfill();

    for (const key in this.document) {
      if (this.document[key]) {
        formData.append(key, this.document[key]);
      }
    }

    return formData;
  }

  createDocument() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const formData = this.getFormData();
    this.documentsService.createDocument(formData)
      .subscribe((document: DocumentModel) => {
        this.document = document;
        this.isSaving = false;
      });
  }

  updateDocument() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const formData = this.getFormData();
    this.documentsService.saveDocument(formData, this.document.id)
      .subscribe((document: DocumentModel) => {
        this.document = document;
        this.isSaving = false;
      });
  }
}
