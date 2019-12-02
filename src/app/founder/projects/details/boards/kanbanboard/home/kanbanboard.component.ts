import {
  Component,
  ComponentFactory,
  ViewEncapsulation,
  ComponentRef,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';
import 'jqwidgets-framework/jqwidgets/jqx-all';
import {TasksService} from 'app/projects/tasks.service';
import TaskModel from 'app/core/models/TaskModel';
import {DynamicKanbanboardComponent} from '../dynamic-kanbanboard/dynamickanbanboard.component';
import {DynamicKanbanboardEditComponent} from '../dynamic-kanbanboard-edit/edit_dynamickanbanboard.component';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';

import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import {MilestonesService} from 'app/projects/milestones.service';
import { LoaderService } from 'app/loader.service';



@Component({
  templateUrl: './kanbanboard.component.html',
  styleUrls: ['./kanbanboard.component.scss'],
  entryComponents: [DynamicKanbanboardComponent, DynamicKanbanboardEditComponent],
  encapsulation: ViewEncapsulation.None,
  providers: [TasksService, MilestonesService]
})
export class KanbanboardComponent  {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  componentRef: ComponentRef<any>;
  localData: any[] = [];
  tasks: TaskModel[];
  is_edit = false;
  edit_btn_class = 'edit-svg-btn';
  milestone_id: number;
  localDataResource: any[] = [];
  milestone_title: string;
  project_id: number;
  project: ProjectModel;

  constructor(
    private milestoneService: MilestonesService,
    private kanbanService: TasksService,
    private projectsService: ProjectsService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {
      this.project = {
        title: '',
        stage: 'idea',
        is_visible: true,
        status: 'draft'
      } as ProjectModel;
      this.getProjectAndMilestoneId();
  }


  initComponent() {
    localStorage.removeItem('localData');
    localStorage.removeItem('localDataSource');
    localStorage.removeItem('localDataResource');
    localStorage.removeItem('project_id');
    localStorage.removeItem('milestone_id');
    localStorage.removeItem('edit_item');
    localStorage.removeItem('taskcountByStatus');
    localStorage.removeItem('project_name');
    localStorage.removeItem('tasks_itemid_originid');
  }

  getProjectAndMilestoneId() {
    this.loaderService.loaderStatus.next(true);
    this.initComponent();
    this.route.params.subscribe((params) => {

      this.milestone_id = params['milestoneId'];
      this.project_id = params['id'];
      this.projectsService.get(params['id']).subscribe((project) => {
        this.project = project;
        this.getResourcesAndCreateComponent();
      });
    });
  }

  getResourcesAndCreateComponent() {
    this.milestoneService.getMilestone(this.project_id, this.milestone_id).subscribe((response) => {
      this.milestone_title = response.title;
      this.loaderService.loaderStatus.next(false);
    });

    localStorage.setItem('milestone_id', this.milestone_id.toString());
    this.kanbanService.list()
      .subscribe((response) => {
        this.tasks = response;

        const databystatus = new Array(5);
        const taskcountByStatus = new Array(5);
        for (let i = 0; i < 5; i++) {
          databystatus[i] = [];
        }

        this.localData = [];
        this.localDataResource = [];
        this.tasks.forEach((task, index, arr) => {
          if (task.parent_task == null && this.milestone_id == task.milestone) {
            const item = {
              id: task.id,
              name: task.title,
              state: task.status,
              label: task.description,
              tags: task.tags[0],
              hex: '#36c7d0',
              resourceId: task.id,
              taskId: task.id,
              order: task.order
            };

            databystatus[task.status - 1].push(item);

            this.localDataResource.push({
              id: task.id,
              name: task.title,
              desc: task.description,
            });
          }
        });

        for (let i = 0; i < 5; i++) {
          databystatus[i].sort(this.compare);
          this.localData = this.localData.concat(databystatus[i]);
          taskcountByStatus[i] = databystatus[i].length;
        }

        if (this.localData === null) {
          this.localData = [];
        }

       localStorage.setItem('localDataSource', JSON.stringify(this.localData));
       localStorage.setItem('localDataResource', JSON.stringify(this.localDataResource));
       localStorage.setItem('taskcountByStatus', JSON.stringify(taskcountByStatus));
       this.createComponent();
    });
  }

  compare(a: TaskModel, b: TaskModel) {
    if (a.order < b.order) {
      return -1;
    } else {
      return 1;
    }
  }

  createComponent() {
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicKanbanboardComponent);
    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.isEdit = this.is_edit;
  }

  editGoalBtnClicked() {
    const add_btn: any = document.querySelector('.add_btn');
    if (add_btn.style.display !== 'none') {
      this.componentRef.destroy();
      this.hideAddButton(true);
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicKanbanboardEditComponent);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.isEdit = this.is_edit;
    } else {
      this.componentRef.destroy();
      this.hideAddButton(false);
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicKanbanboardComponent);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.isEdit = this.is_edit;
    }

  }

  hideAddButton(flag: boolean) {
    const add_btn: any = document.querySelector('.add_btn');
    if (flag) {
      add_btn.style.display = 'none';
      this.edit_btn_class = 'edit-svg-btn close_btn';
    } else {
      add_btn.style.display = 'block';
      this.edit_btn_class = 'edit-svg-btn';
    }
  }
}
