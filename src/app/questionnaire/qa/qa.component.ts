import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Ng2DeviceService } from 'ng2-device-detector';
import * as _ from 'lodash';

import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';
import AnswerValidator from './AnswerValidator';
import Question from 'app/questionnaire/models/Question';
import StageState from 'app/questionnaire/StageState';
import Answer from 'app/questionnaire/models/Answer';
import { StageStorage } from 'app/questionnaire/StageStorage';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-idea-qa',
  templateUrl: './qa.component.html',
  styleUrls: [
    './qa.component.scss',
    './qa.component.portrait.css'
  ],
  providers: [
    AnswerValidator
  ],
})
export class QAComponent implements OnInit, OnDestroy {
  @Input() stageState: StageState;
  @Input() projectStage: 'idea' | 'startup';
  @Output() done = new EventEmitter<boolean>();
  @Output() next = new EventEmitter<Question>();

  private editingIndex = -1;
  private qa: Question[];
  private preventScrollFlag = false;
  private reachedStep = 0;
  private isSubmitting = false;
  private processing = false;
  private loadStagesSubscription: Subscription;

  constructor(private questionnaireService: QuestionnaireService,
    private answerValidator: AnswerValidator,
    private deviceService: Ng2DeviceService,
    private stageStorage: StageStorage
  ) {
    this.qa = [];
  }

  ngOnInit() {
    this.loadStagesSubscription = this.stageStorage.loadStagesEvent.subscribe(() => {
      // console.log(`ng on init`);
      this.loadQAs();
    });
  }

  ngOnDestroy() {
    this.loadStagesSubscription.unsubscribe();
  }

  loadQAs() {
    this.editingIndex = 0;
    this.questionnaireService.getQuestions(this.projectStage)
      .subscribe(
        (questions: Question[]) => {
          questions = _.filter(
            questions, (question) => question['group'] === this.stageState.stage
          );

          questions.forEach((question) => question['answer'] = new Answer());

          for (const answer of this.stageState.answers) {
            const question = _.find(questions, (q) => q.pk === answer.question);
            if (question) {
              question['answer'] = answer;
            }
          }

          this.qa = _.orderBy(questions, ['order']);
          let i = this.qa.findIndex(f => f.pk === this.stageState.nextQuestion);
          // console.log(`find index = ${i}, next question = ${this.stageState.nextQuestion}`);
          if (i > 0) {
            this.setNext(i);
          }
          // this.qa.forEach((question, index) => {
          //   if (question.pk === this.stageState.nextQuestion && index > 0) {
          //     console.log(`for each index = ${index}`);
          //     this.setNext(index);
          //   }
          // });
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
  }

  saveQA(question: any) {

  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  setNext(index: number) {
    if (index < this.qa.length) {
      this.editingIndex = index;
    }

    if (this.reachedStep < this.editingIndex) {
      this.reachedStep = this.editingIndex;
    }

    this.setBlur(index - 1);

    if (this.editingIndex >= this.qa.length) {
      this.stageState.done = true;
      this.scrollBottom();
    } else {
      this.stageState.done = false;
      this.scrollTo(this.editingIndex);
    }
  }

  onNext(index: number) {
    if (index < this.qa.length) {
      this.editingIndex = index + 1;
    }

    if (this.reachedStep < this.editingIndex) {
      this.reachedStep = this.editingIndex;
    }

    const question = this.qa[index];
    this.rememberAnswer(question);

    if (this.stageState.projectId) {
      let currentAnswer: Answer[] = [];
      currentAnswer.push(question.answer);
      this.questionnaireService
        .saveAnswers(currentAnswer, this.stageState.projectId, this.projectStage)
        .subscribe();

      this.setBlur(index);

      if (this.editingIndex >= this.qa.length) {
        this.stageState.done = true;
        this.scrollBottom();
      } else {
        this.stageState.done = false;
        this.scrollTo(this.editingIndex);
      }
    }
    else {
      this.next.emit(null);
    }
  }

  onPrev(index: number) {
    if (index !== 0) {
      this.editingIndex = index - 1;

      this.setBlur(index);
      this.stageState.done = false;
      this.scrollTo(this.editingIndex);
    }

  }

  setFocus(index: number) {
    const device = this.deviceService.getDeviceInfo();

    if (device === 'android' || device === 'iphone') {
      return;
    }
    const id = 'input-' + this.qa[index].pk;
    const element = document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  setBlur(index: number) {
    const id = 'input-' + this.qa[index].pk;
    const element = document.getElementById(id);
    if (element) {
      element.blur();
    }
  }

  scrollTo(index: number) {
    const id = 'card-container-' + index;
    const element = document.getElementById(id);
    if (element) {
      this.preventScrollFlag = true;
      setTimeout(() => {
        this.preventScrollFlag = false;
        this.setFocus(this.editingIndex);
      }, 500);
      element.scrollIntoView(true);
    }
  }

  scrollBottom() {
    setTimeout(() => {
      const element = document.getElementById('done');
      if (element) {
        this.preventScrollFlag = true;
        element.scrollIntoView(true);
      }
    }, 500);
  }

  onScroll(event: any) {
    if (this.preventScrollFlag) {
      return;
    }

    for (let i = 0; i <= this.reachedStep; i++) {
      const id = 'card-' + i;
      const element = document.getElementById(id);
      if (element && i !== this.editingIndex) {
        const rect = element.getBoundingClientRect();
        if (rect.top > 200 && rect.top < 400) {
          this.editingIndex = i;
          this.setBlur(this.editingIndex);

          this.stageState.done = false;
          return;
        }
      }
    }

    if (this.reachedStep === this.qa.length) {
      const element = document.getElementById('divDone');
      const rect = element.getBoundingClientRect();
      if (rect.top < 500) {
        this.setBlur(this.editingIndex);
        this.editingIndex = this.qa.length;
        this.stageState.done = true;
      }
    }
  }

  changeAnswers() {
    this.editingIndex = 0;
    this.stageState.done = false;
  }

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }
    if (this.stageState.projectId) {
      this.isSubmitting = true;
      this.processing = true;
      this.questionnaireService
        .saveAnswers(this.stageState.answers, this.stageState.projectId, this.projectStage)
        .subscribe(
          () => {
            this.isSubmitting = false;
            this.processing = false;
            this.done.emit(true);
          },
          () => {
            this.isSubmitting = false;
            this.processing = false;
          });
    } else {
      for (const question of this.qa) {
        this.rememberAnswer(question);
      }
      this.done.emit(true);
    }
  }

  onForceSave() {
    if (this.stageState.projectId) {
      for (const question of this.qa) {
        this.rememberAnswer(question);
      }
      this.questionnaireService
        .saveAnswers(this.stageState.answers, this.stageState.projectId, this.projectStage)
        .subscribe();
    }
  }

  protected rememberAnswer(question) {
    const answer = _.find(this.stageState.answers, (a) => a.question === question.pk);
    if (!answer) {
      const questionAnswer = question.answer;
      questionAnswer['question'] = question.pk;

      this.stageState.answers.push(questionAnswer);
    }
    if (!this.stageState.projectId) {
      this.stageStorage.saveStagesState();
    }
  }
}
