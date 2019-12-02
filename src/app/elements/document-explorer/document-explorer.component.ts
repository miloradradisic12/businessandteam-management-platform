import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';

import {DocumentExplorerItem} from './DocumentExplorerItem';


/**
 * Document explorer for abstract 'document' and 'folder' items.
 *
 * @input items - collection of 'documents' or 'folders'
 * @output open - event, triggers on some item is opened
 * @output createDocument - event, triggers on selecting new document type from menu
 * @output renameDocument - event, triggers on document renaming
 * @output deleteDocument - event, triggers on document deleting
 */
@Component({
  selector: 'app-document-explorer',
  templateUrl: './document-explorer.component.html',
  styleUrls: [
    './document-explorer.component.scss',
    './document-explorer.component.mobile.scss'
  ]
})
export class DocumentExplorerComponent implements OnInit {
  @Input() items: DocumentExplorerItem[];
  @Output() open: EventEmitter<DocumentExplorerItem> = new EventEmitter();
  @Output() createDocument: EventEmitter<string> = new EventEmitter();
  @Output() renameDocument: EventEmitter<{item: DocumentExplorerItem, name: string}> = new EventEmitter();
  @Output() deleteDocument: EventEmitter<DocumentExplorerItem> = new EventEmitter();
  @ViewChild(NgbDropdown) createDocumentMenu: NgbDropdown;

  ngOnInit() {
    this.createDocumentMenu.up = true;
  }
}
