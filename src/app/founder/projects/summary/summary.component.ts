import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {StageStorage} from 'app/questionnaire/StageStorage';

import {QuestionnaireService} from 'app/questionnaire/questionnaire.service';
import {ProjectsService, Visibility} from 'app/projects/projects.service';

import * as _ from 'lodash';
import AnswerValidator from 'app/questionnaire/qa/AnswerValidator';
import {AuthService} from 'app/auth/auth.service';
import Answer from 'app/questionnaire/models/Answer';
import ProjectModel from 'app/projects/models/ProjectModel';
import {HasId} from 'app/core/interfaces';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  providers: [
    ProjectsService,
    AnswerValidator,
    StageStorage
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class FounderProjectSummaryComponent implements OnInit {
  qaList = {
    idea: [],
    startup: []
  };
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
  ideaId: number;
  project: ProjectModel;
  popUpForDocuSignModalRef: NgbModalRef;

  constructor(
    private questionnaireService: QuestionnaireService,
    private projectsService: ProjectsService,
    private stageStorage: StageStorage,
    private location: Location,
    private auth: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
  }

  getProject() {
    this.projectsService.get(this.ideaId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        this.fetchQAList();
      });
  }

  fetchQAList() {
    this.questionnaireService.getProjectAnswers(this.ideaId,'all')
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
      });
  }

  saveProjectAnswers(stage:string) {
    const questions = _.reduce(this.qaList['idea'].concat(this.qaList['startup']), (result, value) => {
      return result.concat(value.list);
    }, []);

    const answers = questions.map((question) => question.answer);

    this.questionnaireService.saveAnswers(answers, this.ideaId, stage)
      .subscribe(() => {});
  }

  publishProject() {
    this.project.status = 'published';
    this.projectsService.update(<HasId>this.project)
      .subscribe(() => {
        this.router.navigate(['founder', 'projects']);
      });
  }

  setProjectVisibility() {
    this.project.is_visible = !this.project.is_visible;
    this.projectsService.setVisibility(<Visibility>this.project)
      .subscribe(() => {});
  }

  goToStartup() {
    this.projectsService.update({
      id: this.project.id,
      stage: 'startup'
    }).subscribe(() => {
      this.router.navigate(['/founder/startup', this.project.id]);
    });
  }

  goToProject() {
    this.router.navigate(['/founder/projects', this.project.id]);
  }

  openRegister(){
    this.router.navigate([`/founder/projects/${this.project.id}/register`]);
  }

  openLaunch(){
    this.router.navigate([`/founder/projects/${this.project.id}/launch`]);
  }

  checkNda(template) {
    this.projectsService.fetchNda(this.project.id)
      .subscribe(
        data => {
          if (data.docusign_status === 'No Nda' || (data.docusign_status.url != undefined && data.docusign_status.url != '')) {
            this.router.navigate([`/founder/projects/${this.project.id}/nda`]);
          }
          else if (data.docusign_status.url == undefined) {
            this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});            
          }
        },
        error => {
          alert(error);
        }
      );
  }
}
