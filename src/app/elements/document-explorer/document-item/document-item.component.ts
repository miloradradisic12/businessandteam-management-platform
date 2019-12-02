import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DocumentExplorerItem} from '../DocumentExplorerItem';


/**
 * Document item (icon) for DocumentExplorerComponent.
 *
 * @input document - navigation item.
 * @output open - event, triggers on document open
 * @output rename - event, triggers on document renaming
 * @output del - event, triggers on document deleting
 */
@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent {
  @Input() document: DocumentExplorerItem;
  @Output() open: EventEmitter<void> = new EventEmitter();
  @Output() rename: EventEmitter<string> = new EventEmitter();
  @Output() del: EventEmitter<void> = new EventEmitter();

  mode: 'normal' | 'renaming' | 'deleting' = 'normal';
  name: string;

  renameDocument() {
    this.name = this.document.title;
    this.mode = 'renaming';
  }

  applyRenaming() {
    this.rename.emit(this.name);
    this.mode = 'normal';
  }

  deleteDocument() {
    this.mode = 'deleting';
  }

  applyDeleting() {
    this.del.emit();
    this.mode = 'normal';
  }

  cancelDeleting() {
    this.mode = 'normal';
  }
}
