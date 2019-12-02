import { Component, OnInit, Output, EventEmitter, Input, forwardRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotarizeDocument } from '../../projects/models/project-notarization-model';
import { DocumentsService } from '../../projects/documents.service';

@Component({
  selector: 'app-ocr-input',
  templateUrl: './ocr-input.component.html',
  styleUrls: ['./ocr-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OcrInputComponent),
      multi: true
    }, DocumentsService]
})
export class OcrInputComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  @Input() readOnly: boolean = true;
  @Input() isWorkArea: boolean = true;
  @ViewChild('returnContentId') returnContentId: ElementRef;
  @ViewChild('popUpForShowInterestMessage') popUpForShowInterestMessage;
  @ViewChild('popUpForFileTypeMessage') popUpForFileTypeMessage: ElementRef;
  content: any;
  //dropZoneFileTemplate: string;
  flagFile: boolean = false;
  flagSave: boolean = false;
  fileDetail: NotarizeDocument;
  is_handwriting: boolean = false;
  //returnContentId: string;
  returnContent: any;
  file_name: string;

  contentString: any;
  popUpForShowInterestModalRef: NgbModalRef;

  /**
   * Emitter that trigger after some generated data event interaction
   * @param forceSave
   */
  @Output() forceSave = new EventEmitter();

  constructor(private documentsService: DocumentsService,
    private modalService: NgbModal) {
    //this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.fileDetail = new NotarizeDocument();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.content) {
      this.returnContentId.nativeElement.innerHTML = !this.isWorkArea ? this.content.content : this.content;
      this.file_name = !this.isWorkArea ? this.content.file_name : '';
    }
    this.is_handwriting = false;
  }

  saveGeneratedFile(obj) {
    this.content = !this.isWorkArea ? obj : this.returnContentId.nativeElement.innerHTML;
    this.onModelChange(this.content);
    //this.onChange(this.returnContentId.nativeElement.innerHTML);
    this.forceSave.emit();
    //this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, { backdrop: false });
  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    this.content = currentValue ? currentValue : '';
    this.file_name = currentValue ? !this.isWorkArea ? currentValue.file_name : '' : '';
    this.returnContentId.nativeElement.innerHTML = currentValue ? !this.isWorkArea ? currentValue.content : currentValue : '';
    this.is_handwriting = false;
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event,document:string) {
    this.fileDetail.document = $event.src;
    this.updateFile();
  }

  updateFile() {
    this.documentsService.createOCRDocument(this.fileDetail.document, this.is_handwriting, this.isWorkArea).subscribe(
      (obj) => {
        this.returnContentId.nativeElement.innerHTML = obj.content;
        this.file_name = !this.isWorkArea ? obj.file_name : '';
        this.flagSave = true;
        this.saveGeneratedFile(obj);
      },
      (err: any) => {
        console.log(err);
      });
  }

  // filesUpdated(files) {
  //   const file: File = files.reverse()[0];
  //   const fileReader: FileReader = new FileReader();
  //   const self = this;
  //   let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
  //   self.fileDetail.document = file.name;
  //   // set icon on basis of fileType 
  //   fileReader.addEventListener('loadend', function (loadEvent: any) {
  //     self.fileDetail.document = loadEvent.target.result;
  //     self.fileDetail.ext = fileType;
  //     self.updateDropTemplate(fileType);
  //     self.updateFile();
  //   });

  //   fileReader.readAsDataURL(file);
  // }

  // updateDropTemplate(f_type) {
  //   this.flagFile = true;
  //   this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport">            
  //     <a class=${f_type} href=${this.fileDetail.document}><i class="fa fa-file-text-o" aria-hidden="true"></i></a>
  //         </div>`;
  // }

  // removeID() {
  //   this.fileDetail = new NotarizeDocument();      
  //   this.dropZoneFileTemplate = `<div class="file-droppa-document-image file-droppa-passport">
  //       </div>`;
  //   this.flagFile = !this.flagFile;
  //   this.flagSave = false;
  // }

//   /**
//  * This method is called once your drop or select files
//  * You can validate and decline or accept file
//  *
//  * @param file
//  * @returns Boolean
//  */
//   beforeAddFile(file: File) {
//     if (file.type.includes('image')) {
//       return true;
//     }
//     //this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForFileTypeMessage, {backdrop: false});
//     alert('Please upload image only');
//     return false;
//   }

}
