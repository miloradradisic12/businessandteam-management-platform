import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-thought-experiment-source',
  templateUrl: './thought-experiment-source.component.html',
  styleUrls: ['./thought-experiment-source.component.scss']
})
export class ThoughtExperimentSourceComponent implements OnInit {

  question1: string;
  question2: string;
  answer1: string;
  answer2: string;

  @Output() thoughExperimentMsg = new EventEmitter<string>();

  constructor() {
    this.question1 = 'If this where to happen ...';
    this.question2 = 'What do you think would happen if ...';
    this.answer1 = '';
    this.answer2 = '';
   }

  ngOnInit() {
  }

  sendThoughExperimentMessage() {
    if(this.answer1 != '' && this.answer2 != '') {
      const data = '<strong>' + this.question1 + '</strong> \n' + this.answer1 + '\n <br><strong>' + this.question2 + '</strong> \n' + this.answer2;

      this.thoughExperimentMsg.emit(data);
    }
  }

  onTextInputKeyPress(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendThoughExperimentMessage();
    }
  }
}
