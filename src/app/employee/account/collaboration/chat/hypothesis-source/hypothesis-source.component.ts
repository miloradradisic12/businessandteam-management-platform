import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hypothesis-source',
  templateUrl: './hypothesis-source.component.html',
  styleUrls: ['./hypothesis-source.component.scss']
})
export class HypothesisSourceComponent implements OnInit {

  question1: string;
  question2: string;
  question3: string;

  answer1: string;
  answer2: string;
  answer3: string;

  @Output() hypothesisMsg = new EventEmitter<string>();
  
  constructor() {
    this.question1 = 'If this ...';
    this.question2 = 'When I think this will happen ...';
    this.question3 = 'Because of this ...';
    this.answer1 = '';
    this.answer2 = '';
    this.answer3 = '';
   }

  ngOnInit() {
  }

  sendHypothesisMessage() {
    if(this.answer1 != '' && this.answer2 != '' && this.answer3 != '') {
      const data = '<strong>' + this.question1 + '</strong> \n' + this.answer1 + '\n <br><strong>' + this.question2 + '</strong> \n' + this.answer2 + '\n <br><strong>' + this.question3 + '</strong> \n' + this.answer3;
      this.hypothesisMsg.emit(data);
    }
  }

  onTextInputKeyPress(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendHypothesisMessage();
    }
  }
}
