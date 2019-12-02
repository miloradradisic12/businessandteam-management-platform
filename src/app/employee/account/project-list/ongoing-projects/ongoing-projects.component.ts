import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { StageStorage as EmployeeProjectService } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-ongoing-projects',
  templateUrl: './ongoing-projects.component.html',
  styleUrls: ['./ongoing-projects.component.scss'],
   providers: [PaginationMethods]
})
export class OngoingProjectsComponent implements OnInit {
  pageSize = 5;
  count: number;
  projectList: any;
  constructor(private paginationMethods: PaginationMethods,
    private employeeProjectService: EmployeeProjectService, 
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //location.reload()
  }

  getOngoingProjects(newPage) {
    if (newPage) {
      this.employeeProjectService.getOngoingProjectList(newPage, this.pageSize)
      .subscribe((projectList:any) => {
          this.projectList = projectList['results'];
          this.count = projectList['count'];
        });
    }
  }

  onWork(id: number) {
    this.router.navigate([`../${id}/collaboration`], {relativeTo: this.route});
  }
  
}
