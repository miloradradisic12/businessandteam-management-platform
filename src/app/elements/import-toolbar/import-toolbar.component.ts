import {Component, EventEmitter, Input, Output} from '@angular/core';


/**
 * Component for importing files from device/Dropbox/GoogleDrive
 */
@Component({
  selector: 'app-import-toolbar',
  templateUrl: './import-toolbar.component.html',
  styleUrls: ['./import-toolbar.component.scss']
})
export class ImportToolbarComponent {
  @Input() accept = 'image/*';
  @Output() fileChosen: EventEmitter<File> = new EventEmitter();

  getLocalFile(event) {
    if (event.target.files.length) {
      this.fileChosen.emit(event.target.files[0]);
    }
  }
}


