import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { DecisionPollOption } from 'app/collaboration/models';

@Component({
  selector: 'app-decision-poll-source',
  templateUrl: './decision-poll-source.component.html',
  styleUrls: ['./decision-poll-source.component.scss']
})
export class DecisionPollSourceComponent implements OnInit {

  @Input() decisionPollSelected: DecisionPollOption;
  @Output() addOption = new EventEmitter<boolean>();
  @Output() removeOption = new EventEmitter<DecisionPollOption>();
  placeholderText: string;

  constructor() { }

  ngOnInit() {
    this.placeholderText = `Option`;
  }

  addPollOption() {
    this.addOption.emit(true);
  }

  removePollOption() {
    this.removeOption.emit(this.decisionPollSelected);
  }

}
