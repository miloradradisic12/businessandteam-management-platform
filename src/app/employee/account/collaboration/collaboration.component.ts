import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';

import DocumentModel from 'app/core/models/DocumentModel';
import TaskModel from 'app/core/models/TaskModel';
import {ProjectsService} from 'app/projects/projects.service';
import {MilestonesService} from 'app/projects/milestones.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import ProjectModel from 'app/projects/models/ProjectModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';

import {DocumentItem} from './document-explorer/DocumentItem';
import {MilestoneItem} from './document-explorer/MilestoneItem';
import {GoalItem} from './document-explorer/GoalItem';
import {ProcessItem} from './document-explorer/ProcessItem';
import {DocumentTypeFilterComponent} from './document-explorer/document-type-filter/document-type-filter.component';
import {ChatParticipantsComponent} from './document-explorer/chat-participants/chat-participants.component';

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss'],
  entryComponents: [DocumentTypeFilterComponent, ChatParticipantsComponent],
  providers: [MilestonesService]
})
export class CollaborationComponent implements OnInit {

  @ViewChild('rightToolbar', {read: ViewContainerRef}) toolbar: ViewContainerRef;

  selectedGoal: GoalItem;
  selectedProcess: ProcessItem;
  users: Array<Object>;
  isProcessesOpen = true;
  activeProcessId = null;
  project: ProjectModel;
  milestones: Array<MilestoneModel>;
  activeMobileView: null | 'chat' | 'menu' | 'documents';

  constructor(
    private milestonesService: MilestonesService,
    private projectsService: ProjectsService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router,
    private folderNavigation: FolderNavigation
  ) {
    this.project = new ProjectModel();
    this.selectedGoal = null;
    this.selectedProcess = null;
    this.activeMobileView = 'menu';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const projectId = params['id'];
      const goalId = params['goal'];
      const processId = params['process'];

      // this.projectsService.get(projectId)
      //   .subscribe((response) => {
      //     this.project = response;
      //   });

      this.milestonesService.list(projectId)
        .subscribe((milestones: MilestoneModel[]) => {
          this.milestones = milestones;
          this.populateDocumentExplorerItems(milestones);
        });
    });

    this.folderNavigation.opened.subscribe((item: DocumentExplorerItem) => {
      this.toolbar.clear();
      item.createToolbarComponent(this.toolbar, this.resolver);
    });
  }

  /**
   * Transform different models to one common structure for navigation
   */
  populateDocumentExplorerItems(milestones: MilestoneModel[]) {
    for (const milestone of milestones) {
      const milestoneItem = new MilestoneItem(milestone);
      this.folderNavigation.addItem(milestoneItem);
      for (const task of milestone.tasks) {
        const goalItem = new GoalItem(task);
        goalItem.parent = milestoneItem;
        goalItem.open.subscribe(() => {
          this.navigateToGoal(goalItem);
        });
        this.folderNavigation.addItem(goalItem);
        for (const subtask of task.subtasks) {
          const processItem = new ProcessItem(subtask);
          processItem.parent = goalItem;
          processItem.open.subscribe(() => {
            this.navigateToProcess(processItem);
          });
          this.folderNavigation.addItem(processItem);
        }
      }
    }
  }

  openGoal(goal) {
    goal.isCollapsed = !goal.isCollapsed;
    this.folderNavigation.open(new GoalItem(goal));
  }

  navigateToGoal(goalItem: GoalItem) {
    this.selectedGoal = goalItem;
    this.selectedProcess = null;
    this.router.navigate([{
      outlets: {documents: ['goal', goalItem.resource.id]}
    }], {relativeTo: this.route});
  }

  openProcess(process: TaskModel) {
    this.folderNavigation.open(new ProcessItem(process));
  }

  navigateToProcess(processItem: ProcessItem) {
    this.selectedProcess = processItem;
    this.activeMobileView = null;
    this.router.navigate([{
      outlets: {
        documents: ['process', processItem.resource.id],
        chat: ['chat', processItem.resource.id]
      }
    }], {relativeTo: this.route});
  }

  openChat() {
    this.router.navigate([{
      outlets: {
        chat: ['chat', this.selectedProcess.resource.id, {'view': this.activeMobileView}]
      }
    }], {relativeTo: this.route});
  }

  convertToDocumentItems(documents: DocumentModel[]) {
    return _.map(documents, (document) => new DocumentItem(document));
  }

  isGoalSelected(task: TaskModel) {
    return this.selectedGoal && task.id === this.selectedGoal.resource.id
      || this.selectedProcess && task.id === (this.selectedProcess.resource as TaskModel).parent_task;
  }
}
