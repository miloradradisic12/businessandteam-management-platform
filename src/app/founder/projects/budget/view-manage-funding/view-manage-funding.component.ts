import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import ProjectModel from "app/projects/models/ProjectModel";
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import ProjectManageFundsModel from "app/projects/models/ProjectManageFundsModel";

@Component({
    templateUrl: './view-manage-funding.component.html',
    styleUrls: ['./view-manage-funding.component.scss'],
    providers: [PaginationMethods]
})
export class ViewManageFundingComponent implements OnInit {
    projectId: number;
    project: ProjectModel;
    fundsList:ProjectManageFundsModel[] = [];
    pageSize:number = 10;
    count:number = 0;
    searchText:string = '';

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private _location: Location,
    ) {
        this.project = new ProjectModel();
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.loadProject();
            //this.getfunds(1);
        });
    }

    loadProject() {
        this.projectsService.get(this.projectId).subscribe((project) => {
            console.log(project);
            this.project = project;
        });
    }

    getfunds(newPage) {
        if(this.projectId){
            this.projectsService.getManageFundsList(this.projectId,newPage,this.pageSize,this.searchText).subscribe((data)=>{
                this.count = data.count;
                this.fundsList = data.results;
                console.log(data);
            });
        }
    }

    valueChange() {
        if (this.searchText.length > 2 || this.searchText == '') {
          this.getfunds(1);
        }
      }
}