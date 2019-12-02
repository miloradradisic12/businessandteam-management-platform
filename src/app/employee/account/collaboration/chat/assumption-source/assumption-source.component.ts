import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-assumption-source',
  templateUrl: './assumption-source.component.html',
  styleUrls: ['./assumption-source.component.scss']
})
export class AssumptionSourceComponent implements OnInit {

  question1: string;
  question2: string;
  answer1: string;
  answer2: string;

  @Output() assumptionMsg = new EventEmitter<string>();

  constructor() {
    this.question1 = 'If this where to happen ...';
    this.question2 = 'What do you think would happen if ...';
    this.answer1 = '';
    this.answer2 = '';
   }

  ngOnInit() {
  }

  sendAssumtionMessage() {
    if(this.answer1 != '' && this.answer2 != '') {
      const data = this.question1 + '\n' + this.answer1 + '\n' + this.question2 + '\n' + this.answer2;
      this.assumptionMsg.emit(data);
    }
  }

  onTextInputKeyPress(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendAssumtionMessage();
    }
  }

}
