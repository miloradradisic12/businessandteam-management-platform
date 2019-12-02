import { Component, OnInit, Input, AfterViewInit,AfterViewChecked, ElementRef, ViewChild, Renderer2, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
//import { window } from 'rxjs/operator/window';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-presentation-input',
  templateUrl: './presentation-input.component.html',
  styleUrls: ['./presentation-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PresentationInputComponent),
    multi: true
  }]
})
export class PresentationInputComponent implements OnInit, AfterViewInit, AfterViewChecked {
  screenHeight:any;
  screenWidth:any;
  @Input() readOnly: boolean = true;
  selectedTheme: string = 'default';




  /**
   * Emitter that trigger after some generated data event interaction
   * @param forceSave
   */
  @Output() forceSave = new EventEmitter();

  @ViewChild('sliderElement') sliderElement: ElementRef;
  @ViewChild('sliderWrapElement') sliderWrapElement: ElementRef;
  showTextEditor: boolean = false;
  content: any;
  internalContent: string;
  totalSectionCount: number = 1;
  currentPostionIndex: number = 0;
  zoomvalue:any;
  screenMainHeight:any;
  screenMainWidth:any;
  themeList = [
    { label: 'Default', value: 'default' },
    { label: 'Night', value: 'night' },
    { label: 'Beige', value: 'beige' },
    { label: 'Sky', value: 'sky' }
  ]
  //el: ElementRef;
  
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = this.sliderWrapElement.nativeElement.clientHeight;
    this.screenWidth = this.sliderWrapElement.nativeElement.clientWidth;
    if( this.screenHeight<this.screenWidth)
    {
    this.zoomvalue= (this.screenHeight / this.screenWidth);
    }
    else{
      this.zoomvalue= (this.screenWidth / this.screenHeight);
    }
}
  constructor(/*el: ElementRef,*/ private renderer: Renderer2) {
    //this.el = el;
   

  }

  ngOnInit() {
    
   
    
  }
  ngAfterViewChecked(){
    this.onResize();
    this.screenMainHeight = this.sliderWrapElement.nativeElement.clientHeight;
    this.screenMainWidth = this.sliderWrapElement.nativeElement.clientWidth;
  }
  ngAfterViewInit() {
    
    /*const elementCount: number = this.sliderElement.nativeElement.childElementCount;
    if (this.sliderElement.nativeElement && elementCount > 0) {
      for (let index = 0; index < this.sliderElement.nativeElement.childElementCount; index++) {
        //this.sliderElement.nativeElement.children[index].removeEventListener('click', completed);
        if (index == 0) {
          this.sliderElement.nativeElement.children[index].classList.remove("future");
          this.sliderElement.nativeElement.children[index].classList.add("present");

          const newItem = document.createElement("section");
          const newChildItem = document.createElement("p");
          const newTextnode = document.createTextNode("generated section");
          newChildItem.appendChild(newTextnode);
          //newItem.className = 'future';
          newItem.appendChild(newChildItem);
          this.sliderElement.nativeElement.insertBefore(newItem, this.sliderElement.nativeElement.children[index + 1]);
          //this.sliderElement.nativeElement.insertAdjacentHTML('beforeend', '<section>generated section</section>');
        }
        else {
          this.sliderElement.nativeElement.children[index].classList.remove("present");
          this.sliderElement.nativeElement.children[index].classList.add("future");
        }
        const self = this;
        this.sliderElement.nativeElement.children[index].addEventListener("click", function () {
          let d = document.querySelector('.present');
          self.internalContent = d.children[1].innerHTML;
          self.showTextEditor = true;
          d.classList.add('hide-section');
          //self.saveGeneratedFile();
        });
        self.totalSectionCount += 1;
        self.currentPostionIndex = self.totalSectionCount - 1;
      }
    }
    else {
      this.sliderElement.nativeElement.insertAdjacentHTML('beforeend',
        `<section class="present">
        <div class="slide-edit-lock">Edit content</div>
        <div class="kreator-slide-content">
          <p>Hi!</p>
          <p>Welcome to Presentation</p>
        </div>
      </section>
      <input type="hidden" id="selectedTheme" class="theamClass" value="default">`);

      const self = this;
      self.sliderElement.nativeElement.children[0].addEventListener("click", function () {        
        let d = document.querySelector('.present');
        self.internalContent = d.children[1].innerHTML;
        self.showTextEditor = true;
        d.classList.add('hide-section');
      });
    }*/
  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    if (currentValue) {
      this.sliderElement.nativeElement.innerHTML = currentValue;
      this.resetAllClassOfSection();
    }
    else {
      this.sliderElement.nativeElement.innerHTML = '';
      this.sliderElement.nativeElement.insertAdjacentHTML('beforeend',
        `<section class="present">
        <button class="saffron_btn blue_btn slide-edit-lock">Edit content</button>
        <div class="kreator-slide-content">
          <p>Hi!</p>
          <p>Welcome to Presentation</p>
        </div>
      </section>
      <input type="hidden" id="selectedTheme" class="theamClass" value="default">`);

      const self = this;
      self.sliderElement.nativeElement.children[0].addEventListener("click", function () {
        let d = document.querySelector('.present');
        self.internalContent = d.children[1].innerHTML;
        self.showTextEditor = true;
        d.classList.add('hide-section');
      });
    }
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  saveGeneratedFile() {
    this.content = this.sliderElement.nativeElement.innerHTML;
    this.onModelChange(this.content);
    //this.onChange(this.returnContentId.nativeElement.innerHTML);
    this.forceSave.emit();
  }

  addNewSlide() {
    const element = document.querySelector('.slides');
    let isAdded: boolean = false;
    const count = element.childElementCount - 1;
    for (let index = 0; index < count; index++) {

      if (element.children[index].className == 'present') {
        if (isAdded) {
          break;
        }
        element.children[index].className = 'past';
        const newItem = document.createElement("section");

        const newSlideItem = document.createElement("button");
        const newSlideText = document.createTextNode('Edit content');
        newSlideItem.className = 'saffron_btn blue_btn slide-edit-lock';
        newSlideItem.appendChild(newSlideText);

        const newSlideContentItem = document.createElement("div");
        newSlideContentItem.className = 'kreator-slide-content';

        const newItemnode = document.createElement("p");
        const newTextnode = document.createTextNode("Create Slide " + (count + 1));

        newItemnode.appendChild(newTextnode);
        newSlideContentItem.appendChild(newItemnode);

        newItem.className = 'present';
        newItem.appendChild(newSlideItem);
        newItem.appendChild(newSlideContentItem);

        element.insertBefore(newItem, element.children[index + 1]);

        const self = this;
        //element.children[index + 1].addEventListener("click", this.onEditSlide(), false });

        element.children[index + 1].addEventListener("click", function () {
          let d = document.querySelector('.present');
          self.internalContent = d.children[1].innerHTML;
          self.showTextEditor = true;
          d.classList.add('hide-section');
        });
        self.totalSectionCount += 1;
        self.currentPostionIndex += 1;
        isAdded = true;
        self.saveGeneratedFile();
      }
    }
  }

  deleteSlide() {
    const element = document.querySelector('.slides');
    let isDeleted: boolean = false;
    const count = element.childElementCount - 1;
    for (let index = 0; index < count; index++) {

      if (element.children[index].className == 'present') {
        if (isDeleted) {
          break;
        }

        if (this.currentPostionIndex < (count - 1) || this.currentPostionIndex == 0) {
          this.sliderElement.nativeElement.children[index + 1].classList.remove("future");
          this.sliderElement.nativeElement.children[index + 1].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index + 1].classList.remove("past");
          this.sliderElement.nativeElement.children[index + 1].classList.add("present");
        }
        else {
          this.sliderElement.nativeElement.children[index - 1].classList.remove("future");
          this.sliderElement.nativeElement.children[index - 1].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index - 1].classList.remove("past");
          this.sliderElement.nativeElement.children[index - 1].classList.add("present");
          this.currentPostionIndex -= 1;
        }

        element.children[index].remove();
        this.totalSectionCount -= 1;
        this.saveGeneratedFile();
        isDeleted = true;
      }
    }
  }

  changeContentDone() {
    this.showTextEditor = false;
    const d = document.querySelector('.present');
    d.classList.remove('hide-section');
    this.saveGeneratedFile();
  }

  onForceSave() {
    const d = document.querySelector('.present');
    d.children[1].innerHTML = this.internalContent;
  }

  slideLeft() {
    if (this.totalSectionCount > 1) {
      if (this.currentPostionIndex > 0) {
        this.currentPostionIndex -= 1
        this.changePastPresentFuture(true);
      }
    }
  }

  slideRight() {
    if (this.totalSectionCount > 1) {
      if (this.currentPostionIndex < (this.totalSectionCount - 1)) {
        this.currentPostionIndex += 1
        this.changePastPresentFuture(false);
      }
    }
  }

  changePastPresentFuture(isleft: boolean) {
    let element = document.querySelector('.slides');
    if (isleft) {
      element.children[this.currentPostionIndex + 1].className = 'future';
      element.children[this.currentPostionIndex].className = 'present';
    }
    else {
      element.children[this.currentPostionIndex - 1].className = 'past';
      element.children[this.currentPostionIndex].className = 'present';
    }
  }

  resetAllClassOfSection() {
    const elementCount: number = this.sliderElement.nativeElement.childElementCount - 1;
    this.totalSectionCount = elementCount;
    //const elementItem: HTMLElement[] = this.sliderElement.nativeElement.children;
    if (this.sliderElement.nativeElement && elementCount > 0) {
      for (let index = 0; index < elementCount; index++) {
        //this.sliderElement.nativeElement.children[index].removeEventListener('click', completed);
        if (index == 0) {
          this.sliderElement.nativeElement.children[index].classList.remove("future");
          this.sliderElement.nativeElement.children[index].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index].classList.remove("past");
          this.sliderElement.nativeElement.children[index].classList.add("present");
        }
        else {
          this.sliderElement.nativeElement.children[index].classList.remove("present");
          this.sliderElement.nativeElement.children[index].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index].classList.remove("past");
          this.sliderElement.nativeElement.children[index].classList.add("future");
        }
        // console.log(this.sliderElement.nativeElement.children[index].className);
        const self = this;
        this.sliderElement.nativeElement.children[index].addEventListener("click", function () {
          let d = document.querySelector('.present');
          self.internalContent = d.children[1].innerHTML;
          self.showTextEditor = true;
          d.classList.add('hide-section');
        });
      }
    }
    let element = document.querySelector('.theamClass') as HTMLInputElement;
    this.selectedTheme = element.value;
  }

  onThemeChange(value) {
    let element = document.querySelector('.theamClass') as HTMLInputElement;
    element.value = value;
    this.saveGeneratedFile();
  }


}
