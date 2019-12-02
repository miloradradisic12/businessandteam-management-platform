import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";

import { ProjectsService } from 'app/projects/projects.service';

import ProjectLaunchDetailsModel from 'app/projects/models/ProjectLaunchDetailsModel';
import LaunchTypeModel from "app/projects/models/LaunchTypeModel";
import LaunchModel from '../../../projects/models/LaunchModel';
import { CustomValidators } from "app/core/custom-form-validator";

@Component({
    selector: 'app-backer-launch-type',
    templateUrl: './backer-launch-type.component.html',
    styleUrls: ['./backer-launch-type.component.scss'],
    providers: [
        ProjectsService
    ],
})
export class BackerLaunchTypeComponent implements OnInit {
    projectId: number;
    project: ProjectLaunchDetailsModel;

    platforms: LaunchTypeModel[];
    selectedPlatform: LaunchTypeModel;
    selectedPlatformData:LaunchModel;
    isSuccess:boolean = false;

    serverSideErrors:any;

    frmLaunch: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private projectsService: ProjectsService,
    ) {
        this.project = new ProjectLaunchDetailsModel();
        this.platforms = [];

        this.frmLaunch = fb.group({
            quantity: ['', [Validators.required, CustomValidators.numeric]]
        });
    }

    ngOnInit() {
        this.route.params.subscribe((params)=>{
            this.projectId = params['id'];
            this.projectsService.getLaunchDataForBacker(this.projectId)
            .subscribe((project: ProjectLaunchDetailsModel) => {
                this.project = project;               
                this.projectsService.getLaunchingPlatforms()
                .subscribe((platforms: LaunchTypeModel[]) => {
                    this.project.launch.forEach((item)=>{
                        this.platforms.push(...platforms.filter(x=>x.id==item.launch));
                    });
                });
            });
        });
    }

    getIcon(icon: string): string {
        return `/assets/img/project/${icon.toLowerCase()}.png`;
    }

    getColor(platform: string): string {
        let color = '#679BF9';
        switch (platform.toLowerCase()) {
            case 'x':
                color = '#FF6C24';
                break;
            case 'lsx':
                color = '#FE5F5B';
                break;
            case 'isx':
                color = '#00D8C9';
                break;
            default:
                break;
        }
        return color;
    }

    selectPlatform(platform: LaunchTypeModel) {
        console.log(platform);
        console.log(this.project);
        this.selectedPlatform = platform;
        if(this.project.launch.filter(f=>f.launch===platform.id).length>0){
            this.selectedPlatformData = this.project.launch.filter(f=>f.launch===platform.id)[0];
        }
    }

    selectManageFunding(managePopover: NgbPopover){
        if(this.project.manage_fund!==true)
        {
            managePopover.open();
        }
        else{
            //redirect to manage funding page
            this.router.navigate([`/backer/projects/${this.project.id}/funding`]);
        }        
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    backToSelection() {
        this.selectedPlatform = null;
        this.isSuccess = false;
        this.frmLaunch.reset();
    }

    launchProject(value: any) {
        if (this.frmLaunch.valid) {
            let data: {project_launch:number,quantity:number} = {
                project_launch: this.selectedPlatformData.id,
                quantity: value.quantity
            };
            console.log(data);
            this.projectsService.saveLaunchTypePurchaseData(data)
                .subscribe(
                    () => {
                        console.log('Share quantity purchased');
                        this.isSuccess = true;
                    },
                    (errMsg: any) => {
                        console.log('aali re aali error aali');
                        console.log(errMsg);
                        this.serverSideErrors = errMsg;
                        setTimeout(()=>{this.serverSideErrors = null},5000);
                    }
                );
        }
        else {
            this.validateAllFormFields(this.frmLaunch);
        }
    }
}