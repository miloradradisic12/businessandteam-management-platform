import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as RecruiterDirectHireService } from 'app/employeeprofile/stage-storage.service';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-direct-hire',
  templateUrl: './direct-hire.component.html',
  styleUrls: ['./direct-hire.component.scss'],
  providers: [PaginationMethods, RecruitmentService]
})
export class DirectHireComponent implements OnInit {
  
  pageSize = 5;
  count: number;
  recruiterDirectHireRequest: any[];
  popUpForDocuSignModalRef: NgbModalRef;

  constructor(private paginationMethods: PaginationMethods,
    private recruiterDirectHireService: RecruiterDirectHireService,
    private recruitmentService: RecruitmentService,
    private modalService: NgbModal,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getRecuiterInterviewReq(0);
  }

  joinForAppointment(data: any, template) {
    
    this.recruitmentService.getDocuSignStatus(data.emp_id, data.envelop).subscribe((obj)=>{
      if(obj && obj.status && obj.status != '') {
        this.popUpForDocuSignModalRef = this.modalService.open(template, {backdrop: false});
      }
      else {
        this.router.navigate([`${data.id}/none/appointment-letter`], { relativeTo: this.route.parent });    
      }
    });
  }

  rejectForAppointment(id: number) {
    this.recruiterDirectHireService.putRejectDirectHireReqJoin(null,id).subscribe((obj) => {
      this.getRecuiterInterviewReq(1);
    });
  }

  Message() {
  }

  getRecuiterInterviewReq(newPage) {
    if (newPage) {
      this.recruiterDirectHireService.getRecuiterDirectHireReq(newPage, this.pageSize).subscribe((recHireReq) => {
        this.recruiterDirectHireRequest = recHireReq['results'];
        this.count = recHireReq['count'];
      });
    }
    /*this.recruiterDirectHireService.getRecuiterDirectHireReq(null, null).subscribe((recHireReq) => {
      this.recruiterDirectHireRequest = recHireReq;
    });*/
  }

}
