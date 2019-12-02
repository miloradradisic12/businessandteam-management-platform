import { Component, OnInit, TemplateRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';

import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';

import { HasId } from 'app/core/interfaces';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import ProjectModel from 'app/projects/models/ProjectModel';
import { MilestonesService } from 'app/projects/milestones.service';
import { ProjectsService } from 'app/projects/projects.service';
import { MilestoneWorkAdapter } from './adapters';
import * as kf from 'app/elements/hammertime/keyframes';


@Component({
  templateUrl: './operations.component.html',
  styleUrls: [
    './operations.component.scss'
  ],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      //  transition('* => jello', animate(1000, keyframes(kf.jello))),
      //  transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      //  transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      // transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      //  transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY))),
    ])
  ]
})



export class FounderProjectOperationsComponent implements OnInit {
  operations: MilestoneWorkAdapter[];
  chartMode: string;
  chartItemMode: 'view' | 'edit';
  modalOptions: NgbModalOptions;
  modalRef: NgbModalRef;
  confirmDeletingModalRef: NgbModalRef;
  projectId: number;
  project: ProjectModel;
  milestone: MilestoneModel;
  selectedMilestone: MilestoneModel;
  animationState: string;
  pinchout: boolean = false;
  categoryImageList: any[];

  projectMilestones: any[];
  MilestoneInfo: any[];
  lg = 1200;
  md = 768;
  sm = 480;
  showitems: any;
  showdetails: boolean = false;
  leftpos: any;
  slickCurrentSlide: number = 0;
  shownextform:boolean=false;
  showdetailindex:number=0;
  @ViewChild('slickmodal') slickmodal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private projectsService: ProjectsService,
    private milestonesService: MilestonesService
  ) {
    this.project = new ProjectModel();
    this.chartMode = 'week';
    this.chartItemMode = 'view';
    this.modalOptions = {
      backdrop: true,
      container: '#operations-chart',
      size: 'lg',
      windowClass: 'saffron-popup modal-dialog-centered'
    };
    this.projectMilestones = [];
    this.categoryImageList = [];
  }

  startAnimation(state) {
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }
  }
  resetAnimationState() {
    this.animationState = '';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      //this.loadMilestones();
    });
    this.milestonesService.getMilestoneCategoryImages().subscribe(obj => {
      console.log(obj);
      this.categoryImageList = obj;
    });
    //  this.calculatewidth();
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
      this.loadMilestones();
    });
  }

  loadMilestones() {
    this.milestonesService.list(this.projectId).subscribe((milestones) => {
      const is_startup = milestones.findIndex(a => a.is_milestone_in_startup_stage == true);
      if (is_startup > -1)
        milestones[is_startup].progress = this.project.stage == 'startup' ? this.project.progress : 0;
      const operations = _.map(milestones, (milestone) => new MilestoneWorkAdapter(milestone));
      this.operations = _.orderBy(operations, 'order');
      this.projectMilestones = _.orderBy(milestones, 'order');
    });
  }

  setChartMode(chartMode: string) {
    this.chartMode = chartMode;
  }

  openMilestone(milestone) {
    if (!milestone.is_milestone_in_startup_stage) {
      this.router.navigate([this.project.id, 'boards', milestone.id], {
        relativeTo: this.route.parent
      });
    }
    else {
      if (this.project.stage == 'startup' && this.project.progress == 100) {
        this.router.navigate([this.project.id, 'summary'], {
          relativeTo: this.route.parent
        });
      }
      else {
        this.router.navigate(['../startup', this.project.id], {
          relativeTo: this.route.parent
        });
      }
    }

  }

  openModal(template: TemplateRef<any>, milestone?: MilestoneModel) {

    this.shownextform=false;
    if (milestone) {
      this.milestone = _.cloneDeep(milestone);
      this.milestone.isPlaceAfterChanged=false;
      
    } else {
      this.milestone = new MilestoneModel();
      this.milestone.date_start = moment().hour(8).minute(0).second(0).toDate();
      this.milestone.date_end = moment().hour(17).minute(0).second(0).toDate();
      this.milestone.project = this.projectId;
      this.milestone.icon_name = '';
      this.milestone.icon_category = 'Apartments & Private';
      //this.milestone.place_it_after = '';
      this.milestone.order=0;
    }
    this.modalRef = this.modal.open(template, this.modalOptions);
  }

  createMilestone() {
 //   debugger;
    console.log(this.milestone);

    this.milestonesService.create(this.milestone)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
      },(error)=>{
        console.log(error);
      });
  }

  updateMilestone() {
    debugger;
    this.milestonesService.update(this.milestone as HasId)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
      });
  }

  confirmDeleting(template) {
    this.confirmDeletingModalRef = this.modal.open(template, { backdrop: false });
  }

  deleteMilestone() {
    debugger;
    this.milestonesService.delete(this.milestone as HasId)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
        this.confirmDeletingModalRef.close();
      });
  }

  onSelectedWorkChange(work: MilestoneWorkAdapter) {
    this.selectedMilestone = work ? work.milestone : null;
  }

  toggleEditMode() {
    if (this.chartItemMode === 'view') {
      this.chartItemMode = 'edit';
    } else {
      this.chartItemMode = 'view';
    }
  }

  //  Milestone Slider Related

  // getItemShowCount() {
  //   if (window.outerWidth > this.lg) {
  //     this.showitems = 5;
  //   }
  //   else if (window.outerWidth <= this.lg && window.outerWidth > this.md) {
  //     this.showitems = 4;
  //   } else if (window.outerWidth <= this.md && window.outerWidth > this.sm) {
  //     this.showitems = 3;
  //   }
  //   else {
  //     this.showitems = 2.5;
  //   }
  // }

  selectMilestone(e, getMilestone, index) {
    // debugger;
    this.MilestoneInfo = getMilestone;
  //  console.log(e);
  //  console.log(getMilestone);
   // this.getItemShowCount();
    this.showdetails = true;
    this.showdetailindex= index;

    // this.leftpos = (((this.slickmodal.nativeElement.clientWidth / this.showitems) * index));
    // if(this.leftpos>this.slickmodal.nativeElement.clientWidth)
    // {
    //   this.leftpos = this.leftpos - this.slickmodal.nativeElement.clientWidth + "px";
    // }
    // else{
    //   this.leftpos = this.leftpos + "px";
    // }
  }

  slideConfig = {
    "slidesToShow": 5, "slidesToScroll": 5, 'infinite': false, 'arrows': true,'adaptiveHeight': true,

    responsive: [
      {
        'breakpoint': 1200,
        settings: {
          'slidesToShow': 4,
          "slidesToScroll": 4,
        }
      },
      {
        'breakpoint': 768,
        settings: {
          'slidesToShow': 3,
          "slidesToScroll": 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          "slidesToScroll": 2,
        }
      }
    ]
  };

  addSlide() {
    // this.slides.push({img: "http://placehold.it/350x150/777777"})
  }

  removeSlide() {
    // this.slides.length = this.slides.length - 1;
  }

  afterChange(e) {
    console.log(e);
    this.slickCurrentSlide = e.slick.currentLeft;
    this.showdetails = false;
  }
  getformview(formshow: any){
    this.shownextform = formshow;
  }
}
