import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

import ProjectModel from 'app/projects/models/ProjectModel';
import {ProjectsService} from 'app/projects/projects.service';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import {SliceIndexModel} from '../../../elements/pagination/SliceIndexModel';
import {SelectItem} from 'primeng/primeng';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss',
    './overview.component.medium.scss',
  ],
  providers: [PaginationMethods]
})
export class BackerProjectsOverviewComponent implements OnInit {
  projects: ProjectModel[];
  stage: '' | 'idea' | 'startup' = '';
  projectStages = {
    idea: 'Idea Stage',
    startup: 'Startup Stage'
  };
  searchText: '';
  pageSize = 5;
  count: number;
  
  description:string='The moment you think of buying a Web Hosting Plan, you know one thing –  So many choices, which one to choose?  Whether you would want to choose Shared Linux Packages or a Unix Package or  do you want to go for a shared windows package or packages reseller for hosting?  Trust me, a lot of individuals stand confused when they see that there'; 
  itemsPerPage;
  sliceIndex: SliceIndexModel;
  projectType: SelectItem[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private projectsService: ProjectsService,
    private paginationMethods: PaginationMethods
  ) {
    this.projectType = [
      {label: 'All', value: ''},
      {label: 'Idea', value: 'idea'},
      {label: 'Startup', value: 'startup'},
  ];
  }

  ngOnInit() {}

  getNewProjectList(newPage) {
    if (newPage) {
      this.projectsService.listPublished(newPage, this.pageSize)
        .subscribe((projects: ProjectModel[]) => {
          this.projects = projects['results'];
          this.count = projects['count'];
        });
    }
  }

  openProject(project) {
    this.router.navigate(['.', project.id], {relativeTo: this.route});
  }

  selectfunding(project){
    this.router.navigate([project.id, 'launch'], {relativeTo: this.route});
  }

  navigateTo(project) {
    this.router.navigate([project.id, 'summary'], {relativeTo: this.route});
  }
}
