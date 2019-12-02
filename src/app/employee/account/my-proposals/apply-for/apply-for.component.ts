import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as ApplyForJobService } from 'app/employeeprofile/stage-storage.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apply-for',
  templateUrl: './apply-for.component.html',
  styleUrls: ['./apply-for.component.scss'],
  providers: [PaginationMethods, RecruitmentService]
})
export class ApplyForComponent implements OnInit {
  pageSize = 5;
  count: number;
  myJobApply: any[];
  popUpForDocuSignModalRef: NgbModalRef;
  
  constructor(private paginationMethods: PaginationMethods, 
    private recruitmentService: RecruitmentService,
    private applyForJobService: ApplyForJobService,
    private modalService: NgbModal,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    //this.getJobApply(1);
  }

  RescheduledInterview(id: number) {
    let flag: boolean = false;
    this.router.navigate([`${id}/${true}/interview`], { relativeTo: this.route.parent });
  }

  /**
   * used for sending the interviewRequest id of Recuiter
   * @param interviewRequest 
   */
  joinForAppointment(data, template) {
    this.recruitmentService.getDocuSignStatus(data.offer_details.emp_id, data.offer_details.envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        this.router.navigate([`${data.id}/${true}/appointment-letter`], { relativeTo: this.route.parent });
      }
    });
  }

  rejectForAppointment(id: number) {
    this.applyForJobService.putRejectAppliedRecuiterReqJoin(null,id).subscribe((obj) => {
      this.getJobApply(1);
    });
  }

  Message() {
  }

  RejectInterview(id: number) {
    this.applyForJobService.putRejectAppliedRecuiterInterviewReqSchedule(null,id).subscribe((obj) => {
      this.getJobApply(1);
    });
  }

  getJobApply(newPage){
    if(newPage) {
      this.applyForJobService.getJobApply(newPage, this.pageSize).subscribe((appliedJob) => {
        this.myJobApply = appliedJob['results'];
        this.count = appliedJob['count'];
      });
    }
  }

}
