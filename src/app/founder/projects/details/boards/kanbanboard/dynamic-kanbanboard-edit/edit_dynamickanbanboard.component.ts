import {
  Component,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'jqwidgets-framework/jqwidgets/jqx-all';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import {TasksService} from 'app/projects/tasks.service';
import TaskModel from 'app/core/models/TaskModel';

@Component({
  templateUrl: './edit_dynamickanbanboard.component.html',
  styleUrls: ['./edit_dynamickanbanboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TasksService]
})


export class DynamicKanbanboardEditComponent {
 @ViewChild('myKanbanboard') myKanbanboard: jqxKanbanComponent;
 @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) container: ViewContainerRef;

  project_id: number;
  result: any;
  tasks: TaskModel[] = [];
  dataAdapter: any;
  fields: any[] = [{
      name: 'id',
      type: 'string'
    }, {
      name: 'title',
      map: 'title',
      type: 'string'
    }, {
      name: 'status',
      map: 'state',
      type: 'string'
    }, {
      name: 'text',
      map: 'label',
      type: 'string'
    }, {
      name: 'tags',
      type: 'string'
    }, {
      name: 'color',
      map: 'hex',
      type: 'string'
    }, {
      name: 'resourceId',
      map: 'resourceId',
      type: 'number'
    }, {
      name: 'order',
      type: 'number'
    }
  ];

  source: any = {
    localData: [],
    dataType: 'array',
    dataFields: this.fields
  };

   resourcesSource: any = {
      localData: [],
      dataType: 'array',
      dataFields: [{
          name: 'id',
          type: 'number'
        },
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'desc',
          type: 'string'
        },
      ]
    };

  columns = [];

  template: string =
    '<div class="jqx-kanban-item" id="">' +
    '<div style="display:flex;align-items:center;" ><div class="jqx-kanban-item-color-status"></div>' +
    '<a class="jqx-kanban-item-edit-btn" ></a></div>' +
    '<div style="display: none;" class="jqx-kanban-item-avatar"></div>' +
    '<div class="jqx-icon jqx-icon-close jqx-kanban-item-template-content jqx-kanban-template-icon"></div>' +
    '<div class="jqx-kanban-item-text"></div>' +
    '<div style="display: none;" class="jqx-kanban-item-footer"></div>' +
    '</div>';


  constructor(
    private kanbanService: TasksService,
    private route: ActivatedRoute
  ) {
    this.source.localData = JSON.parse(localStorage.getItem('localDataSource')) || [];
    if (!this.source.localData.length) {
      this.source.localData.push({});
    }
    this.resourcesSource.localData = JSON.parse(localStorage.getItem('localDataResource'));
    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.kanbanService.getStatuses()
      .subscribe((statuses: any[]) => {
        statuses.forEach((item) => {
          item['text'] = item.title;
          item['iconClassName'] = null;
          item['dataField'] = item.id;
          item['maxItems'] = 16;
          item['collapsible'] = false;
        });
        this.columns = statuses;
      });
  }

  columnRenderer(element: any, collapsedElement: any, column: any): void {}

  itemRenderer(element: any, item: any, resource: any): void {
    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = '<span style="line-height: 23px;' +
    ' margin-left: 5px;">' + resource.name + '</span>';

    // const container = element[0].getElementsByClassName('jqx-kanban-item-text')[0];
    const edit_btn = element[0].getElementsByClassName('jqx-kanban-item-edit-btn')[0];
    edit_btn.addEventListener('click', (event: any): void => {
      window.location.href += `/editgoal/${item.resourceId}`;
    });
  }

  myKanbanboardOnItemMoved(event: any): void {
    let order;

    const el = document.getElementsByClassName('jqx-kanban-item');
    for (let i = 0; i < el.length; i++) {
      const id_attr = el[i]['id'];
      if (id_attr.indexOf('_' + event.args.itemData.resourceId) !== -1) {
        const elem = document.getElementById(id_attr);
        order = Array.prototype.slice.call(elem.parentElement.children).indexOf(elem);
      }
    }

    this.updateStatusAndOrder(
      event.args.itemData.resourceId,
      event.args.newColumn.dataField,
      order
    );
  }

  updateStatusAndOrder(task_id: number, status: number, order: number) {
    let data_newtask: any;
    this.kanbanService.get(task_id).subscribe(resp => {
      data_newtask = {
        'title': resp.title,
        'milestone': resp.milestone,
        'status': status,
        'order': order
      };
      this.kanbanService.updateTask(task_id, data_newtask)
        .subscribe((response) => {
          this.updateLocalData();
        });
    });
  }

  updateLocalData() {
    const localDataResource = [];
    this.kanbanService.list()
      .subscribe((response) => {
        this.tasks = response;

        const databystatus = new Array(4);
        // const taskcountByStatus = new Array(4);
        for (let i = 0; i < 4; i++) {
          databystatus[i] = [];
        }
        let milestone_id;
        this.route.params.subscribe((params) => {
          milestone_id = params['milestoneId'];
        });

        this.tasks.forEach((task) => {
          if (task.parent_task == null && milestone_id === task.milestone.toString()) {
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

            localDataResource.push({
              id: task.id,
              name: task.title,
              desc: task.description,
            });
          }
        });

        let localData = [];
        for (let i = 0; i < 4; i++) {
          databystatus[i].sort(this.compare);
          localData = localData.concat(databystatus[i]);
        }

        localStorage.setItem('localDataSource', JSON.stringify(localData));
        localStorage.setItem('localDataResource', JSON.stringify(localDataResource));
      });
  }

  resourcesAdapterFunc(): any {
    return new jqx.dataAdapter(this.resourcesSource);
  }

  compare(a: TaskModel, b: TaskModel) {
    if (a.order < b.order) {
      return -1;
    } else {
      return 1;
    }
  }
}
