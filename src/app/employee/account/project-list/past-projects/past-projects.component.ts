import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as EmployeeProjectService } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-past-projects',
  templateUrl: './past-projects.component.html',
  styleUrls: ['./past-projects.component.css'],
  providers: [PaginationMethods]
})
export class PastProjectsComponent implements OnInit {
  pageSize = 5;
  projectList: any;
  count: number;
  searchText: string = '';
  constructor(private paginationMethods: PaginationMethods,
    private employeeProjectService: EmployeeProjectService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  getOngoingProjects(newPage) {
    if (newPage) {
      this.employeeProjectService.getPastProjectList(newPage, this.pageSize, this.searchText)
        .subscribe((projectList: any) => {
          this.projectList = projectList['results'];
          this.count = projectList['count'];
        });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getOngoingProjects(1);
    }
  }

}
