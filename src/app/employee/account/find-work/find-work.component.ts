import { Component, OnInit,HostListener } from '@angular/core';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { commonFilters, FindWorkFilters } from '../../../employeeprofile/models/find-work-filters';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-find-work',
  templateUrl: './find-work.component.html',
  styleUrls: ['./find-work.component.scss'],
  providers: [PaginationMethods]
})
export class FindWorkComponent implements OnInit {
  pageSize = 5;
  count: number;
  findWorkFilters: FindWorkFilters = new FindWorkFilters();
  jobData: any[];
  myApplyJob: any[];
  filteropen:boolean=true;
  jobposting:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router,private findWorkService:StageStorage) { }
  @HostListener("window:resize", [])
  onWindowResize() {
    // this.kyb_left_height();
    if (window.innerWidth < 992) {
     this.filteropen=false;
     this.jobposting=false;
     }
     else{
       this.filteropen=true;
       this.jobposting=true;
     }
  }
  ngOnInit() {
    
    this.findWorkService.getAvailabilityDetails().subscribe((emp)=>{
      if(!emp.is_completed){
        this.router.navigate(['./employee/account/profile']);
      }
      else{
        this.getJobApply()
        if (window.innerWidth < 992) {
          this.filteropen=false;
          this.jobposting=false;
          }
          else{
            this.filteropen=true;
            this.jobposting=true;
          }
      }
    })

      

  }

  filteropenpanel()
  {
    if (window.innerWidth < 992) {
    this.filteropen=!this.filteropen;
    }
  }
  postingopenpanel()
  {
    if (window.innerWidth < 992) {
    this.jobposting=!this.jobposting;
    }
  }

  selectedFilters(event: any) {
      this.findWorkFilters = event;
      this.getJobList(1);
  }

  getJobList(newPage) {
    if (newPage) {
      this.findWorkService.getJobList(newPage, this.pageSize,this.findWorkFilters.categories,this.findWorkFilters.expertise,this.findWorkFilters.experience,this.findWorkFilters.sub_categories,this.findWorkFilters.hourlybudget,this.findWorkFilters.availability)
      .subscribe((empJobList:any[]) => {
          this.jobData = empJobList['results'];
          this.count = empJobList['count'];
        });
    }
  }

  getJobApply(){
    this.findWorkService.getJobApply().subscribe((myApplyJob: any[])=>{
      this.myApplyJob = myApplyJob;
    })
  }

  ScheduledInterview(jobId: number){
    this.router.navigate([`${jobId}/apply-job`], {relativeTo: this.route.parent});
  }
}
