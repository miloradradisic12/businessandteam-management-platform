import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {QuestionnaireService} from 'app/questionnaire/questionnaire.service';
import {ProjectsService} from 'app/projects/projects.service';

import * as _ from 'lodash';
import AnswerValidator from 'app/questionnaire/qa/AnswerValidator';
import {AuthService} from 'app/auth/auth.service';
import Answer from 'app/questionnaire/models/Answer';
import ProjectModel from 'app/projects/models/ProjectModel';
import {StageStorage} from 'app/questionnaire/StageStorage';
import { vdCanvasService } from '../../../elements/vd-canvas/vd-canvas.service';


@Component({
  providers: [
    ProjectsService,
    AnswerValidator,
    QuestionnaireService,
    vdCanvasService,
    StageStorage
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class BackerProjectsSummaryComponent implements OnInit {

  // qaList = [];
  projectStages = [
    {key: 'idea', title: 'Idea Stage'},
    {key: 'startup', title: 'Startup Stage'}
  ];
  questionGroups = {
    express: 'Express',
    develop: 'Develop',
    visual: 'Visual',
    target: 'Target',
    plan: 'Plan',
    operation_management: 'Operations Management',
    finances_outline: 'Finances Outline',
    sales_strategy: 'Sales Strategy',
    marketing_plan: 'Marketing Plan'
  };
  qaList = {
    idea: [],
    startup: []
  };
  ideaId: number;
  project: ProjectModel;

  constructor(
    private questionnaireService: QuestionnaireService,
    private projectsService: ProjectsService,
    private location: Location,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private stageStorage: StageStorage
  ) {
    this.ideaId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.project = new ProjectModel();
  }

  ngOnInit(
  ): void {
    if (this.auth.isTemporaryUser()) {
      this.stageStorage.loadStagesState();
    }
    this.getProject();
    // this.getQAList();
  }

  getProject() {
    this.projectsService.getPublished(this.ideaId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        this.fetchQAList();
      });
  }

  fetchQAList() {
    this.questionnaireService.getPublishedAnswers(this.ideaId)
      .subscribe((projectAnswers: Answer[]) => {
        this.populateQAList(projectAnswers, 'idea');
        if (this.project.stage === 'startup') {
          this.populateQAList(projectAnswers, 'startup');
        }
      });
  }

  populateQAList(projectAnswers: Answer[], projectStage: 'idea' | 'startup') {
    return this.questionnaireService.getQuestions(projectStage)
      .subscribe((questions: any[]) => {
        const questionGroups = _.groupBy(questions, (question) => question.group);
        _.forEach(questionGroups, (groupQuestions, groupKey) => {
          groupQuestions = _.sortBy(groupQuestions, (question) => question.order);

          _.forEach(groupQuestions, (question) => {
            question['answer'] = _.find(projectAnswers, {question: question.pk}) || new Answer();
          });

          this.qaList[projectStage].push({
            group: groupKey,
            isCollapsed: true,
            list: groupQuestions
          });
        });

        console.log('QAList', this.qaList);
      });
  }
}
