import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StageStorage as InterviewAppliedService } from 'app/employeeprofile/stage-storage.service';
import * as moment from 'moment';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { MyInterviewRescheduleComponent } from '../my-interview-reschedule/my-interview-reschedule.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-interview',
  templateUrl: './my-interview.component.html',
  styleUrls: ['./my-interview.component.scss']
})
export class MyInterviewComponent implements OnInit {
  id: number;
  isApply: boolean;
  interviewData: any;
  internal_interview_date: any;
  internal_interview_time: any;
  reschedule_interview_date: any;
  reschedule_interview_time: any;
  reschedule_interview_creator_date: any;
  reschedule_interview_creator_time: any;

  constructor(private interviewAppliedService: InterviewAppliedService,
    private route: ActivatedRoute, private router: Router,
    private _location: Location,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.isApply = (params['isApply'] === 'true');
      if (!this.isApply) {
        this.getInterviewScheduleByReq();
      }
      else {
        this.getAppliedInterviewScheduleByReq();
      }
    });
  }

  getInterviewScheduleByReq() {
    //this.interviewAppliedService.getAppliedRecuiterInterviewReqSchedule(this.id).subscribe((obj) => {
    this.interviewAppliedService.getInterviewRecuiterInterviewReqSchedule(this.id).subscribe((obj) => {
      this.setScheduleAndRescheduleData(obj);
      
    });
  }

  getAppliedInterviewScheduleByReq() {
    this.interviewAppliedService.getAppliedRecuiterInterviewReqSchedule(this.id).subscribe((obj) => {
      this.setScheduleAndRescheduleData(obj);
      
    });
  }

  setScheduleAndRescheduleData(obj: any){
    if (obj) {
      //obj.interview_date_time = moment(obj.interview_date_time).toDate()
      this.internal_interview_date = obj.interview_date_time.split('T')[0];
      this.internal_interview_time = obj.interview_date_time.split('T')[1].split(':00Z')[0];
      if(obj.reschedule_interviews != undefined && obj.reschedule_interviews.length > 0 && obj.reschedule_interviews[0].reschedule_interview_date_time != undefined){
        //obj.reschedule_interviews[0].reschedule_interview_date_time = moment(obj.reschedule_interviews[0].reschedule_interview_date_time).toDate();
        this.reschedule_interview_date = obj.reschedule_interviews[0].reschedule_interview_date_time.indexOf('T') !== -1 ? obj.reschedule_interviews[0].reschedule_interview_date_time.split('T')[0] : obj.reschedule_interviews[0].reschedule_interview_date_time.split(' ')[0];
        this.reschedule_interview_time = obj.reschedule_interviews[0].reschedule_interview_date_time.indexOf('T') !== -1 ? obj.reschedule_interviews[0].reschedule_interview_date_time.split('T')[1].split(':00Z')[0] : obj.reschedule_interviews[0].reschedule_interview_date_time.split(' ')[1];
      }
      if(obj.reschedule_interviews != undefined && obj.reschedule_interviews.length > 0 && obj.reschedule_interviews[0].reschedule_interview_date_time_creator != undefined){
        this.reschedule_interview_creator_date = obj.reschedule_interviews[0].reschedule_interview_date_time_creator.indexOf('T') !== -1 ? obj.reschedule_interviews[0].reschedule_interview_date_time_creator.split('T')[0] : obj.reschedule_interviews[0].reschedule_interview_date_time_creator.split(' ')[0];
        this.reschedule_interview_creator_time = obj.reschedule_interviews[0].reschedule_interview_date_time_creator.indexOf('T') !== -1 ? obj.reschedule_interviews[0].reschedule_interview_date_time_creator.split('T')[1].split(':00Z')[0] : obj.reschedule_interviews[0].reschedule_interview_date_time_creator.split(' ')[1];
      }
      this.interviewData = obj;
    }
  }

  rescheduleMyInterview() {
    const modalRef = this.modalService.open(MyInterviewRescheduleComponent, {
      windowClass:'interviewmodel modal-dialog-centered'
    });
    modalRef.componentInstance.rescheduledata=this.interviewData;  
    modalRef.componentInstance.is_creator = false;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.interviewData.reschedule_interviews = [];//emmitedValue;
      this.interviewData.reschedule_interviews.push(emmitedValue);
      this.setScheduleAndRescheduleData(this.interviewData);
      //this.setScheduleAndRescheduleData(emmitedValue);
      //this.flagHired = emmitedValue;
    });
  }

  confirmAvailability(){
    this.interviewAppliedService.confirmInterviewAvailability({
      id: this.isApply?this.interviewData.job_application : this.interviewData.id,
      status: 'accept'
    },this.isApply).subscribe((ret:any) => {
      this.interviewData.status = ret.status;
    });
  }

  confirmAvailabilityText(){
    return (this.interviewData && this.interviewData.status==='accept')?'Availability Confirmed':'Confirm Availability';
  }
}
