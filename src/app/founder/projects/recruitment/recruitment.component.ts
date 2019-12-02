import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {FormsModule} from '@angular/forms';
import {Location} from '@angular/common';


@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class FounderProjectRecruitmentComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  isCollapsedArray : boolean[] = [];
  qaList: any[] =[
    {
      "panelname": "Post a Job",
    },
    {
      "panelname": "Hire Employees",
    },{
      "panelname": "Proposals",
    },
    {
      "panelname": "My Employees",
    },
    {
      "panelname": "Previous Employees",
    }]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
  ) { 

    this.project = new ProjectModel();

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
    
    this.qaList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }
  toggleAccordian(e,x){
    let lastopen=this.isCollapsedArray[x];
    this.qaList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;
  
   }

}
