import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { MetricesService } from 'app/projects/metrices.service';
import { MetricesModel } from 'app/projects/models/metrices-model';
import {Location} from '@angular/common';

@Component({
  selector: 'app-processes-worked-on',
  templateUrl: './processes-worked-on.component.html',
  styleUrls: ['./processes-worked-on.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class ProcessesWorkedOnComponent implements OnInit {
  pageSize = 10;
  count: number;
  paginationReset: boolean = false;
  searchText: string;
  projectId: number;
  employeeId: number;
  project: ProjectModel;
  metricesModel: MetricesModel;
  selectedProcessId: number;

  constructor(private paginationMethods: PaginationMethods, config: NgbRatingConfig,
    private route: ActivatedRoute, private router: Router, private _location: Location,
    private projectsService: ProjectsService, private metricesService: MetricesService) {

    config.max = 5;
    config.readonly = true;
    this.project = new ProjectModel();
    this.metricesModel = new MetricesModel();
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.employeeId = params['empid'];
      this.loadProject();
      this.getCurrentEmployeePayDetails();
    });
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getCurrentEmployeePayDetails() {
    this.metricesService.getCurrentEmployeeProfileProcess(this.employeeId, this.projectId.toString()).subscribe((data) => {
      
      this.metricesModel.basicInfo = data;
      data && data.processes.length > 0 ? this.selectedProcessId = data.processes[0].process_id : this.selectedProcessId = 0;
      //this.getProcessSelectedList(1);
    });
  }

  getProcessSelected(process_id) {
    this.selectedProcessId = process_id;
    this.getProcessSelectedList(1);
  }

  getProcessSelectedList(newPage) {
    this.metricesService.getCurrentEmployeeProcessList(this.employeeId, this.projectId.toString(), this.selectedProcessId, newPage, this.pageSize, this.searchText).subscribe((data) => {      
      this.metricesModel.ProcessListInfo = data;
      this.count = data.count;
    });
  }

}
