import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder, NgForm, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { ToDoTaskModel, ToDoListModel } from 'app/projects/models/to-do-task-model';
import { ListingData, SelectItem } from 'app/employeeprofile/models/employee-professional-info';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
  providers: [PaginationMethods]
})
export class TodolistComponent implements OnInit {
  project_id: number;
  complexForm: FormGroup;
  todotaskInfo: ToDoTaskModel;
  //todotaskInfoList: ToDoTaskModel[] = [];
  addtask: boolean = false;
  remaindOn: string;
  dueDateOn: string;
  // snooze_optionList: SelectItem[];
  snooze_timeList: SelectItem[];
  repeatList: SelectItem[];
  dayList: SelectItem[];
  isSnoozTime: boolean = false;
  isRepeat: boolean = false;
  isDay: boolean = false;
  //objKeyMessage: any;
  pageSize = 5;
  count: number;
  pageSize1 = 5;
  count1: number;
  searchText: string = '';
  errorMessage: any[];
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForConfirmationMessage') popUpForConfirmationMessage;
  //minDateValue: Date = new Date();


  /**
   * Added from new form
   */

  todoListInfo: ToDoListModel;
  todoListTempInfo: ToDoListModel;
  items: FormArray[] = [];
  todotaskInfoList: ToDoListModel[] = [];
  completedTodotaskInfoList: ToDoListModel[] = [];

  frequency_time: any[] = [];

  objKeyMessage: any;
  minDateValue: Date = new Date();
  minDateTimeValue: Date = new Date(2018, 1, 1, 9, 0);
  maxDateTimeValue: Date = new Date(2018, 1, 1, 17, 0);

  constructor(private fb: FormBuilder, private router: Router, private _location: Location,
    private route: ActivatedRoute, private projectsToDoListService: ProjectsService, private modalService: NgbModal) {
    this.complexForm = this.fb.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.     
      'id': [''],
      'task': ['', Validators.required],
      'task_description': [''],
      'remind': [''],//daily, weekly, monthly or yearly
      'remind_me': [''],//24 hrs or betweentime
      'start_on': ['', Validators.required],
      'end_on': ['', Validators.required],
      'frequency': ['', Validators.required],
      'let_system_do_it': [''],
      'is_complete': [''],
      //'repeat': [''],
      'repeat_days': ['', Validators.required],
      'repeat_months': ['', Validators.required],
      'project': ['', Validators.required],
      'frequency_time1': ['', Validators.required],
      'frequency_time2': ['', Validators.required],
      'frequency_time3': ['', Validators.required],
      'frequency_id1': [''],
      'frequency_id2': [''],
      'frequency_id3': ['']

      //items: this.fb.array([this.createItem()])

      //frequency_time: ['', Validators.required]
      //'frequency_time': fb.array([ this.createItem()])

    });
    this.todoListInfo = new ToDoListModel();
    //this.todoListTempInfo = new ToDoListModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
      this.getToDoList(1);
      this.getCompletedToDoList(1);
    });
    this.setFormValue();
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
        : this.complexForm.controls['common'].setErrors(newErr);

    });
  }

  submitToDoList(value: any) {
    // value.start_on = this.todoListInfo.start_on;
    // value.end_on = this.todoListInfo.end_on;
    const dataInfo: any = Object.assign({}, value);
    dataInfo.start_on = moment(value.start_on).format('YYYY-MM-DD');
    dataInfo.end_on = moment(value.end_on).format('YYYY-MM-DD');
    dataInfo.remind = this.todoListInfo.remind;
    if (this.complexForm.valid) {

      // dataInfo.repeat_days = this.todoListInfo.remind == 'weekly' && this.todoListInfo.repeat_days && this.todoListInfo.repeat_days.length >0 ? this.todoListInfo.repeat_days : [];
      // dataInfo.repeat_months = this.todoListInfo.remind == 'monthly' && this.todoListInfo.repeat_months && this.todoListInfo.repeat_months.length >0 ? this.todoListInfo.repeat_months : [];
      dataInfo.repeat_days = this.todoListInfo.remind == 'weekly' && dataInfo.repeat_days && dataInfo.repeat_days.length > 0 ? dataInfo.repeat_days : [];
      dataInfo.repeat_months = this.todoListInfo.remind == 'monthly' && dataInfo.repeat_months && dataInfo.repeat_months.length > 0 ? dataInfo.repeat_months : [];

      this.todoListInfo.frequency_time = [];
      // !dataInfo.let_system_do_it ? this.todoListInfo.frequency_time.push({id: dataInfo.frequency_id1, time: moment(dataInfo.frequency_time1).format('HH:MM:SS')}) : [];
      // !dataInfo.let_system_do_it && this.todoListInfo.frequency > 1 ? this.todoListInfo.frequency_time.push({id: dataInfo.frequency_id2, time: moment(dataInfo.frequency_time2).format('HH:MM:SS')}) : [];
      // !dataInfo.let_system_do_it && this.todoListInfo.frequency > 2 ? this.todoListInfo.frequency_time.push({id: dataInfo.frequency_id3, time: moment(dataInfo.frequency_time3).format('HH:MM:SS')}) : [];
      !dataInfo.let_system_do_it ? this.todoListInfo.frequency_time.push({ id: dataInfo.frequency_id1, time: moment(dataInfo.frequency_time1).format('HH:mm:ss') }) : [];
      !dataInfo.let_system_do_it && this.todoListInfo.frequency > 1 ? this.todoListInfo.frequency_time.push({ id: dataInfo.frequency_id2, time: moment(dataInfo.frequency_time2).format('HH:mm:ss') }) : [];
      !dataInfo.let_system_do_it && this.todoListInfo.frequency > 2 ? this.todoListInfo.frequency_time.push({ id: dataInfo.frequency_id3, time: moment(dataInfo.frequency_time3).format('HH:mm:ss') }) : [];

      dataInfo.frequency_time = this.todoListInfo.frequency_time;

      if (value.id == 0) {
        this.projectsToDoListService.toDoListNewPost(dataInfo, this.project_id).subscribe((obj) => {
          this.resetForm();
          this.addtask = !this.addtask;
        },
          (errorMsg: any) => {
            if (errorMsg.error !== undefined) {
              this.errorMessage = errorMsg.error;
            } else {
              this.errorMessage = errorMsg[0].task_description[0];
            }
            this.checkForErrors(errorMsg);
          });
      }
      else {
        this.projectsToDoListService.toDoListNewPut(dataInfo, this.project_id).subscribe((obj) => {          
          this.resetForm();
          this.addtask = !this.addtask;
        }, (errorMsg: any) => {
          this.checkForErrors(errorMsg);
        });
      }

    }
    else {
      this.validateAllFormFields(this.complexForm);
    }
  }

  onRepeatSelect(data) {
    if (data === 'daily') {
      this.isDay = false;
    }
    else {
      this.isDay = true;
    }
  }

  onCheckedItemChanged(value: boolean) {
    this.isRepeat = value;
    this.isDay = false;
    this.complexForm.controls['repeat'].setValue('');
  }

  isSnoozTimeFun(value: boolean) {
    this.isSnoozTime = value;
    this.complexForm.controls['snooze_time'].setValue('');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });

    });
  }

  getToDoList(newPage) {
    if (newPage) {
      this.projectsToDoListService.toDoListGet(this.project_id, newPage, this.pageSize, this.searchText)
        .subscribe((todoList: any) => {
          this.todotaskInfoList = todoList['results'];
          this.count = todoList['count'];
        });
    }
  }

  getCompletedToDoList(newPage) {
    if (newPage) {
      this.projectsToDoListService.completedToDoListGet(this.project_id, newPage, this.pageSize1, this.searchText)
        .subscribe((todoList: any) => {
          this.completedTodotaskInfoList = todoList['results'];
          this.count1 = todoList['count'];
        });
    }
  }

  setFormValue() {
    this.todoListTempInfo = new ToDoListModel();
    this.todoListInfo.start_on = this.todoListInfo.start_on != null && this.todoListInfo.start_on != undefined ? moment(this.todoListInfo.start_on).toDate() : new Date()
    this.todoListInfo.end_on = this.todoListInfo.end_on != null && this.todoListInfo.end_on != undefined ? moment(this.todoListInfo.end_on).toDate() : new Date()
    this.minDateValue = this.todoListInfo.start_on;//Object.assign({}, this.todoListInfo.start_on);
    let months = this.todoListTempInfo.repeat_monthList.map(x => Object.assign({}, x));
    let days = this.todoListTempInfo.repeat_dayList.map(x => Object.assign({}, x));

    // this.date.setHours(time.hour);
    // this.date.setMinutes(time.minute);
    // this.date.setSeconds(time.second);

    //this.setFrequencyTime();

    this.complexForm.setValue({
      'id': this.todoListInfo.id = this.todoListInfo.id != undefined ? this.todoListInfo.id : 0,
      'task': this.todoListInfo.task != undefined ? this.todoListInfo.task : '',
      'task_description': this.todoListInfo.task_description != undefined ? this.todoListInfo.task_description : '',
      'remind': this.todoListInfo.remind ? this.todoListInfo.remind : this.todoListInfo.remind = 'daily',
      'remind_me': this.todoListInfo.remind_me = this.todoListInfo.remind_me ? this.todoListInfo.remind_me : this.todoListTempInfo.remindMeList[0].key,
      'start_on': this.todoListInfo.start_on,
      'end_on': this.todoListInfo.end_on,
      //'frequency': this.todoListInfo.frequency = this.todoListInfo.frequency ? {id: this.todoListInfo.frequency, value: this.todoListInfo.frequency} : this.todoListInfo.frequencyList[2],
      'frequency': this.todoListInfo.frequency = this.todoListInfo.frequency ? this.todoListInfo.frequency : this.todoListTempInfo.frequencyList[2].id,
      'let_system_do_it': this.todoListInfo.let_system_do_it = this.todoListInfo.let_system_do_it ? this.todoListInfo.let_system_do_it : false,
      'repeat_days': this.todoListInfo.repeat_days && this.todoListInfo.repeat_days.length > 0 ? this.todoListInfo.repeat_days : days.map(a => a.id),
      'repeat_months': this.todoListInfo.repeat_months && this.todoListInfo.repeat_months.length > 0 ? this.todoListInfo.repeat_months : months.map(a => a.id),
      'project': this.project_id,
      'frequency_time1': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 0 ? new Date(2018, 1, 1, parseInt(this.todoListInfo.frequency_time[0].time.split(':')[0]), parseInt(this.todoListInfo.frequency_time[0].time.split(':')[1])) : new Date(2018, 1, 1, 9, 0),
      'frequency_time2': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 1 ? new Date(2018, 1, 1, parseInt(this.todoListInfo.frequency_time[1].time.split(':')[0]), parseInt(this.todoListInfo.frequency_time[1].time.split(':')[1])) : new Date(2018, 1, 1, 12, 0),
      'frequency_time3': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 2 ? new Date(2018, 1, 1, parseInt(this.todoListInfo.frequency_time[2].time.split(':')[0]), parseInt(this.todoListInfo.frequency_time[2].time.split(':')[1])) : new Date(2018, 1, 1, 15, 0),
      'frequency_id1': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 0 ? this.todoListInfo.frequency_time[0].id : 0,
      'frequency_id2': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 1 ? this.todoListInfo.frequency_time[1].id : 0,
      'frequency_id3': this.todoListInfo.id != 0 && this.todoListInfo.frequency_time && this.todoListInfo.frequency_time.length > 2 ? this.todoListInfo.frequency_time[2].id : 0,
      'is_complete': this.todoListInfo.is_complete ? this.todoListInfo.is_complete : false,
      //'items':this.addItem(),

    });
  }

  checkDateValidation(from, to) {
    if (moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate()) {
      this.complexForm.controls['end_on'].setValue(moment(from.inputFieldValue).toDate());
    }
  }

  editTask(item: any) {
    this.todoListInfo = Object.assign({}, item);
    this.setFormValue();
    this.addtask = !this.addtask;
  }

  deleteTask(item: any) {
    this.projectsToDoListService.toDoListDelete(item).subscribe((obj) => {
      this.resetForm();
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg);
    });
  }

  resetForm() {
    this.complexForm.reset();
    //this.todotaskInfo = new ToDoTaskModel();
    this.todoListInfo = new ToDoListModel();
    this.setFormValue();
    this.getToDoList(1);
    this.getCompletedToDoList(1);
  }

  addeditTodoList() {
    this.addtask = !this.addtask;
    //this.todoListInfo = new ToDoListModel();
  }

  onDaySelect(event) {
    console.log(event);
  }

  onFrequencySelect(event) {
    console.log(event);
    this.todoListInfo.frequency = event;
  }

  onMonthSelect(event) {
    console.log(event);
  }

  completedTask() {
    this.todoListInfo.is_complete = true;
    this.projectsToDoListService.toDoListNewPut(this.todoListInfo, this.project_id).subscribe((obj) => {
      this.popUpForShowInterestModalRef.close();
      this.resetForm();
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg);
    });
  }

  confirmTaskComplete(value:boolean, item: ToDoListModel) {
    if (value) {
      const dataInfo: any = Object.assign({}, item);
      dataInfo.start_on = moment(item.start_on).format('YYYY-MM-DD');
      dataInfo.end_on = moment(item.end_on).format('YYYY-MM-DD');
      this.todoListInfo = dataInfo;
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForConfirmationMessage, { backdrop: false });
    }
  }

  closeConfirmMessage() {
    this.popUpForShowInterestModalRef.close();
    this.todoListInfo = new ToDoListModel();
  }

}
