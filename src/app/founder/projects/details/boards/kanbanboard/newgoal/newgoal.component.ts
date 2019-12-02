import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {ProcessComponent} from './processDirective/process.component';
import {TasksService} from 'app/projects/tasks.service';
import {AccountService} from 'app/founder/account/account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import ProjectModel from 'app/projects/models/ProjectModel';
import {ProjectsService} from 'app/projects/projects.service';
import TaskModel from 'app/core/models/TaskModel';
import {DependencyComponent} from './dependency/dependency.component';
import {MilestonesService} from 'app/projects/milestones.service';
import { LoaderService } from 'app/loader.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';

@Component({
  templateUrl: './newgoal.component.html',
  entryComponents: [ProcessComponent],
  styleUrls: [
    './newgoal.component.scss'

  ] ,
  providers: [TasksService]

})
export class KanbanboardNewGoalComponent implements OnInit {
  goal: TaskModel;
  result: any;
  milestone_id: number;
  current_user: UserProfileModel;
  subtasks: TaskModel[];
  project: ProjectModel;
  project_id: number;
  milestones: any[];  
  dependencies: any[];
  msgArray = [];
  currentMilestone: MilestoneModel;
  processError: boolean;

  constructor(
    private kanbanService: TasksService,
    private accountService: AccountService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private milestonesService: MilestonesService,
    private loaderService: LoaderService
  ) {
    this.goal = new TaskModel();
    this.goal.due_date = new Date();
    // XXX: Status id should be got from the server
    this.goal.status = 1;

    this.project = new ProjectModel();
    this.subtasks = [];
    this.dependencies = [];
    this.currentMilestone = new MilestoneModel();
    this.processError = false;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
      this.milestone_id = params['milestoneId'];
      this.goal.title = '';
      this.goal.milestone = this.milestone_id;
      this.projectsService.get(params['id']).subscribe((project) => {
        this.project = project;
        this.goal.project = project.id;
      });
    });

    this.accountService.getProfile().subscribe(response => {
      this.current_user = response;
      this.goal.assignee = this.current_user.id;
    });

    this.getMilestones();
  }

  backBtnClicked() {
    window.history.back();
  }

// Add Process Component dynamically
  addProcessBtnClicked() {
    this.processError = false;
    const date = this.currentMilestone.date_start > new Date() ? this.currentMilestone.date_start : new Date()
      const process = {
        title: `Process ${this.subtasks.length + 1}`,
        due_date: date,
        parent_task: this.goal.id,
        milestone: this.goal.milestone,
        status: 1
      } as TaskModel;
      this.subtasks.push(process);
    /*if(this.currentMilestone.date_end >= new Date()){
    }
    else{
      this.processError = true;
    }*/
  }

  createTaskClicked() {
    this.goal.dependency_task = this.dependencies;
    let createTask = this.kanbanService.addTask(this.goal);
    for (const subtask of this.subtasks) {
      createTask = createTask.flatMap((task: TaskModel) => {
        subtask.parent_task = task.parent_task || task.id;
        return this.kanbanService.addTask(subtask);
      });
    }
    createTask.subscribe(() => {
      this.router.navigate(['.'], {relativeTo: this.route.parent});
    },
    (errMsg: any) => {
      this.loaderService.loaderStatus.next(false);
      this.checkForErrors(errMsg);
    });
  }

  addDependencyBtnClicked() {
    let dependency = {
      milestone: null,
      task: null
    };

    this.dependencies.push(dependency);
  }
  
  getMilestones() {
    this.milestonesService.list(this.project_id).subscribe( (resp) => {
        this.milestones = [];      
        this.currentMilestone = resp.filter(a=>a.id == this.milestone_id)[0];
        resp.forEach(e=>{
          this.milestones.push({
            id: e.id, label: e.title, value: e.id          
          });
        });      
    });
  }
  
  checkForErrors(errorMsg) {
    this.msgArray = [];
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      const value = errorMsg[err];

      if (value[0].milestone !== undefined) {
          //this.msgArray.push(element.milestone[0]);      
          this.msgArray.push('Milestone cannot be blank');
      } else {
        this.msgArray.push(value);   
      }
         
    });
  }
}
