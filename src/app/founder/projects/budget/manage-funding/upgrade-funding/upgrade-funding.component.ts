import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {UpgradeModel, UpgradePackageModel} from 'app/projects/models/upgrade-model';

import { UnsubscribeNewUpgradeComponent } from './unsubscribe-new-upgrade/unsubscribe-new-upgrade.component';

@Component({
  selector: 'app-upgrade-funding',
  templateUrl: './upgrade-funding.component.html',
  styleUrls: ['./upgrade-funding.component.scss']
})
export class UpgradeFundingComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  upgradeListing: UpgradeModel[];
  currentPackage: UpgradePackageModel;
  errorMessage: string = '';
  @ViewChild('popUpForShowInterestMessage') popUpForShowInterestMessage;
  popUpForShowInterestModalRef: NgbModalRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private modalService: NgbModal ) {
    this.project = new ProjectModel();
    this.upgradeListing = [];
    this.currentPackage = new UpgradePackageModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      this.getUpgradeListing();
      this.getSubscribePackage();
    });
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getUpgradeListing() {
    this.projectsService.getUpgradeListing().subscribe((upgradeListing) => {
      this.upgradeListing = upgradeListing;
    });
  }

  postSubscribePackage(selectedPackage: UpgradeModel) {
    let data: UpgradePackageModel = new UpgradePackageModel();
    data.project = this.projectId;
    data.package = selectedPackage.id;
    data.is_active = true;
    this.projectsService.postUpgradeSubscribePackage(this.projectId, data).subscribe((obj) => {
      this.currentPackage = obj[0];
      this.getUpgradeListing();
    }, (error) => {
      this.errorMessage = error[0];
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
    });
  }

  getSubscribePackage() {
    this.projectsService.getSubscribeUpgradeListing(this.projectId).subscribe((subscribePackage) => {
      if(subscribePackage && subscribePackage.length > 0){
        this.currentPackage = subscribePackage[0];
      }
    });
  }

  showPopUpToConfirm(selectedPackage: UpgradeModel) {
    const modalRef = this.modalService.open(UnsubscribeNewUpgradeComponent, {
      windowClass: 'Unsubscribe package modal-dialog-centered'
    });
    modalRef.componentInstance.currentPackage = this.currentPackage;
    this.currentPackage.selected_package = selectedPackage.id;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue) {
        this.projectsService.putUpgradeSubscribePackage(this.currentPackage, this.projectId).subscribe((obj)=>{
          this.postSubscribePackage(selectedPackage);
        }, (error) => {
          this.errorMessage = error[0];
          this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
        });
      }
    });
  }
}
