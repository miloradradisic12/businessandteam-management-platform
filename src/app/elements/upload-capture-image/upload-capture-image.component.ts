import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-upload-capture-image',
    templateUrl: './upload-capture-image.component.html',
    styleUrls: ['./upload-capture-image.component.scss']
})
export class UploadCaptureImageComponent implements OnInit {

    @Output() filechanged = new EventEmitter<HTMLImageElement>();
    @Input() withFileDroppa: boolean = false;
    @Input() dropTriggerId: string = 'uploadTrigger';
    @Input() imageSrc: string = null;
    
    dropZoneTemplate: string = `<div class="file-droppa-document-image file-droppa"></div>`;
    webCamMissing: boolean = false;
    public webcam;
    options;
    popoverTimerList = {};
    @ViewChild('takePhotoPopover') takePhotoPopover: NgbPopover;

    constructor() {
        this.options = {
            audio: false,
            video: true,
            width: 300,
            height: 200,
            fallbackMode: 'callback',
            fallbackSrc: 'jscam_canvas_only.swf',
            fallbackQuality: 85,
            cameraType: 'front'
        };
    }

    ngOnInit(){
        if(this.imageSrc){
            this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                        <img src=${this.imageSrc} alt="">
                    </div>`;
        }
    }

   /**
   * This method is called once your drop or select files
   * You can validate and decline or accept file
   *
   * @param file
   * @returns Boolean
   */
  beforeAddFile(file:File){
    if(file.type.includes('image')){
      return true;
    }
    alert('Please upload image only');
    return false;
  }

    showWebCamMissing() {
        var that = this;
        that.webCamMissing = true;
        setTimeout(() => {
            that.webCamMissing = false;
        }, 5000);
    }

    openCameraPopover() {
        try {
            var n = <any>navigator;
            const that = this;
            n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
            n.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                that.webCamMissing = false;
                that.takePhotoPopover.open();
            }, function (err) {
                // Log the error to the console.
                that.showWebCamMissing();
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
            );
        } catch (error) {
            this.showWebCamMissing();
            console.log('The following error occurred when trying to use getUserMedia: ' + error);
        }
    }

    onCamSuccess(photo) {
        this.webCamMissing = false;
    }

    onCamError(err) {
        this.showWebCamMissing();
        this.takePhotoPopover.close();
    }

    makeWebCameraPhoto() {
        const that = this;
        this.webcam.getBase64()
            .then((base64) => {
                const image: HTMLImageElement = new Image();
                image.src = base64;
                image.addEventListener('load', () => {
                    that.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                        <img src=${base64} alt="">
                    </div>`;
                    that.imageSrc = base64;
                    that.filechanged.emit(image);
                });
                that.takePhotoPopover.close();
            })
            .catch(e => console.error(e));
    }

    closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName): void {
        clearTimeout(this.popoverTimerList[timerName]);
        this.popoverTimerList[timerName] = setTimeout(() => {
            popoverId.close();
        }, timer);
    }

    removeImage() {
        this.imageSrc = null;
        const image: HTMLImageElement = new Image();
        this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa"></div>`;
        this.filechanged.emit(image);
    }

    /**
 * Callback called after new photo was chosen
 */
    fileChangeListener($event) {
        const image: HTMLImageElement = new Image();
        const file: File = this.withFileDroppa ? $event.reverse()[0] : $event.target.files[0];
        const fileReader: FileReader = new FileReader();
        const that = this;

        fileReader.addEventListener('loadend', function (loadEvent: any) {
            image.src = loadEvent.target.result;
            image.addEventListener('load', function () {
                that.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                        <img src=${image.src} alt="">
                    </div>`;
                that.imageSrc = image.src;
                that.filechanged.emit(image);
            });
        });

        fileReader.readAsDataURL(file);
    }
}