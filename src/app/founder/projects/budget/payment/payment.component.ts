import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PaginationMethods]
})
export class PaymentComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  pageSize = 5;
  count: number;
  searchText: '';
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private paginationMethods: PaginationMethods) 
    { 
      this.project = new ProjectModel();

    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }
  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
     // this.getMyEmpoloyeeList(1);
    }
  }
  getPaymentInfo(newPage)
  {

  }
}
