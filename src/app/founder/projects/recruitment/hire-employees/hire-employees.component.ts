import { Component, OnInit, HostListener, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentLetterComponent } from '../appointment-letter/appointment-letter.component';
import { ScheduledInterviewComponent } from '../scheduled-interview/scheduled-interview.component';
import { RescheduledInterviewComponent } from '../rescheduled-interview/rescheduled-interview.component';
import { Subscription } from "rxjs/Subscription";
import { ScheduleInterviewModel } from 'app/projects/models/ScheduleInterviewModel';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';

import { DocuSigndocpreviewComponent } from 'app/founder/projects/employee-profile/docu-signdocpreview/docu-signdocpreview.component'

@Component({
  selector: 'app-hire-employees',
  templateUrl: './hire-employees.component.html',
  styleUrls: ['./hire-employees.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class HireEmployeesComponent implements OnInit {
  pageSize = 5;
  count: number;

  private employees: HireEmployeeModel[];
  //projects: ProjectModel[];
  searchText: '';
  scheduleOn: string;
  _scheduleOnSubscription: Subscription = new Subscription();
  scheduleInterviewData: ScheduleInterviewModel;
  stage: string;
  _hireEmployeeFiltersSubscription: Subscription = new Subscription();
  private hireEmployeeFilters: PublishJobModel;
  department: number;
  role: number;
  expertise: number;
  experience: number;
  availability: number;
  hourlybudget: number;

  filteropen = true;
  @Input() projectId: number;

  popUpForDocuSignModalRef: NgbModalRef;


  constructor(private paginationMethods: PaginationMethods,
    private recruitmentService: RecruitmentService,
    config: NgbRatingConfig,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) {
    config.max = 5;
    config.readonly = true;
    this.employees = [];
    this.scheduleInterviewData = new ScheduleInterviewModel();
    this.hireEmployeeFilters = new PublishJobModel();
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.kyb_left_height();
    if (window.innerWidth < 768) {
      this.filteropen = false;
    }
    else {
      this.filteropen = true;
    }
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {

  }

  ngOnInit() {

    this._hireEmployeeFiltersSubscription = this.recruitmentService.hireEmployeeFilters
      .subscribe(
      (obj) => {
        if (obj != undefined) {
          this.hireEmployeeFilters = obj;

          this.fetchData(this.hireEmployeeFilters);
        }
        //this.getList(this.status);
        if (window.innerWidth < 768) {
          this.filteropen = false;
        }
        else {
          this.filteropen = true;
        }
      }
      );
  }

  fetchData(empFilter: PublishJobModel) {

    if (empFilter.department.length != 0) {
      this.department = empFilter.department[0];
    }
    if (empFilter.role.length != 0) {
      this.role = empFilter.role[0];
    }
    if (empFilter.expertise.length != 0) {
      this.expertise = empFilter.expertise[0];
    }
    if (empFilter.availability.length != 0) {
      this.availability = empFilter.availability[0];
    }
    if (empFilter.experience.length != 0) {
      this.experience = empFilter.experience[0];
    }
    if (empFilter.hourlybudget.length != 0) {
      this.hourlybudget = empFilter.hourlybudget[0];
    }
    this.getNewEmpoloyeeList(1);
  }


  filteropenpanel() {
    if (window.innerWidth < 768) {
      this.filteropen = !this.filteropen;
    }
  }
  interviewletter(emp: any) {
    const modalRef = this.modalService.open(AppointmentLetterComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.emp = emp;
    modalRef.componentInstance.letterFrom = 'hireEmployee';
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue) {
        this.getNewEmpoloyeeList(1);
      }
    });
  }
  ScheduledInterview(emp: any) {
    const modalRef = this.modalService.open(ScheduledInterviewComponent, {
      windowClass: 'interviewmodel modal-dialog-centered'
    });
    modalRef.componentInstance.emp = emp;
    modalRef.componentInstance.status = 'schedule';
    modalRef.componentInstance.direct_hire = true;
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.isJobList = true;

  }

  checkDocuSign(emp: any, template) {
    this.recruitmentService.getDocuSignStatus(emp.id, emp.envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        const modalRef = this.modalService.open(DocuSigndocpreviewComponent, {
          size: 'lg',
          windowClass: 'appoitmentmodel'
        });
        modalRef.componentInstance.URL = obj.url;
      }
    });
  }
  // RescheduledInterview()
  // {
  //   const modalRef = this.modalService.open(RescheduledInterviewComponent);
  // }
  getNewEmpoloyeeList(newPage) {
    if (newPage) {
      this.recruitmentService.list(newPage, this.pageSize, this.department, this.expertise, this.role, this.experience, this.hourlybudget, this.availability, this.searchText)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob['results'];
          this.count = empJob['count'];
          // this.paginationReset = false;
        });
    }
  }

  valueChange() {
    // if(this.searchText.length>2 || this.searchText==undefined || this.searchText==''|| this.searchText==null)
    if (this.searchText.length > 2 || this.searchText == '') {
      //this.paginationReset = true;
      this.getNewEmpoloyeeList(1);
    }

  }

  getProfile(empId: any) {
    this.router.navigate(['founder/projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

  //   scheduleIt()
  // {
  //   debugger;
  //   this.scheduleInterviewData.interview_date_time=this.scheduleOn;
  //       this.recruitmentService.scheduleInterview(this.scheduleInterviewData)
  //     .subscribe(
  //             (response: string) => {
  //               //navigate to password-updated page
  //               // this.clearData();
  //               },
  //            (errMsg: any) => {
  //               console.log('errMsg');
  //               console.log(errMsg);

  //                 }
  //               );
  // }
}
