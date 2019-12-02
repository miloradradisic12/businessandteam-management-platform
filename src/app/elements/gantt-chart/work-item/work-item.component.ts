import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

import {Work, WorkItemDragEvent} from '../interfaces';


/**
 * Work item view for Gantt Chart.
 *
 * @input work - abstract work, should have title, startDate, endDate and progress fields
 * @input selected - work item selection state
 * @input mode - can be 'view' or 'edit'
 *
 * @output openWork - event, triggered when the work going to be opened
 * @output editWork - event, triggered when edit button pressed
 * @output selectedChange - event, triggered when selection change
 * @output dragStart - event, triggered when mouse are captured on the component
 */
@Component({
  selector: 'app-gantt-chart-work-item',
  template: `
    <div class="work-item" [class.selected]="selected">
      <div class="work-title">
        {{work.title}}
        <div class="edit-btn {{mode}}" (click)="editWork.next(work)">
          <i class="fa fa-pencil"></i>
        </div>
      </div>
      <div class="work-progress" [class.draggable]="mode=='edit'">
        <div class="drag-trigger left"></div>
        <div class="work-progress-completed"
             [style.width]="work.progress + '%'">
          <div class="percents">{{work.progress}}%</div>
        </div>
        <div class="drag-trigger right"></div>
      </div>
    </div>
  `,
  styles: [`
    .work-item {
      padding: 2px;
    }
    .work-item .edit-btn.view {
      display: none;
    }
    .work-item .edit-btn.edit {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .work-title {
      color: #4342E6;
      font-size: 14px;
      line-height: 18px;
      display: flex;
      //justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      margin-bottom: 2px;
    }
    .work-title .edit-btn {
      min-height: 18px;
      min-width: 18px;
      height: 18px;
      width: 18px;
      border: 1px dashed #7C7BF4;
      border-radius: 50%;
      cursor: pointer;
      margin-left: 10px;
    }
    .work-title .edit-btn .fa {
      color: #7C7BF4;
      font-size: 12px;
    }
    .work-progress {
      height: 24px;
      border: 1px solid #7C7BF4;
      background-color: #DEDEF5;
      text-align: left;
      position: relative;
    }
    .work-progress.draggable:hover {
      cursor: move;
    }
    .drag-trigger{
      position: absolute;
      width: 2px;
      top: 0;
      bottom: 0;
    }
    .drag-trigger.left {
      left: 0;
    }
    .drag-trigger.right {
      right: 0;
    }
    .work-progress.draggable .drag-trigger:hover {
      cursor: ew-resize;
    }
    .work-item.selected .work-progress {
      box-shadow: 0 0 0 1px #7C7BF4;
    }
    .work-progress-completed {
      height: 100%;
      width: 0;
      background-color: #7C7BF4;
    }
    .percents {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      margin-left: 12px;
      line-height: 22px;
    }
  `]
})
export class GanttChartWorkItemComponent {
  @Input() work: Work;
  @Input() selected = false;
  @Input() mode: 'view' | 'edit' = 'view';

  @Output() openWork: EventEmitter<Work> = new EventEmitter();
  @Output() editWork: EventEmitter<Work> = new EventEmitter();
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dragStart: EventEmitter<WorkItemDragEvent> = new EventEmitter();

  @HostListener('click')
  onClick() {
    if (this.mode === 'view') {
      this.openWork.next(this.work);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (this.mode === 'edit') {
      let update = 'both';
      if (event.target.classList.contains('left')) {
        update = 'startDate';
      } else if (event.target.classList.contains('right')) {
        update = 'endDate';
      }

      this.dragStart.emit({
        work: this.work,
        type: update
      } as WorkItemDragEvent);
    }
  }
}
