import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {trigger, state, style, transition} from '@angular/animations';
import {fadeAnimation, scaleAnimation} from '../app.animations';
import {ConfirmationService} from 'primeng/primeng';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { LoaderService } from 'app/loader.service';

const scaleAppearAnimation = [
  state('visible', style({
    opacity: 1
  })),
  state('*', style({
    opacity: 0
  })),

  transition('* => visible', [
    scaleAnimation(300, 0, 1)
  ]),
  transition('visible => *', [
    scaleAnimation(300, 1, 0)
  ])
];

const fadeAppearAnimation = [
  state('visible', style({
    opacity: 1
  })),
  state('disabled', style({
    opacity: 0.5,
    cursor: 'wait'
  })),
  state('*', style({
    opacity: 0
  })),

  transition('* => visible', [
    fadeAnimation(500, 0, 1)
  ]),
  transition('visible => *', [
    fadeAnimation(500, 1, 0)
  ])
];



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [
    trigger('titleState', scaleAppearAnimation),
    trigger('buttonState1', fadeAppearAnimation),
    trigger('buttonState2', fadeAppearAnimation),
    trigger('buttonState3', fadeAppearAnimation),
    trigger('buttonState4', fadeAppearAnimation),
  ],
  providers: [ConfirmationService,StageStorage]
})
export class EmployeeComponent implements OnInit {
  titleState: string;
  buttonState1: string;
  buttonState2: string;
  buttonState3: string;
  buttonState4: string;
  popoverTimerList = {};
  startPage = 1;
  pageSize = 1;
  accountPopoverMessage: string;
  
  // projectPopoverMessage:string;
  // proposalPopoverMessage: string;
  findWorkPopoverMessage: string;
  
  popoverFloating: string;

  isProjectsLoading = false;
  isNewIdeaLoading = false;




  constructor(private router: Router,
    private route: ActivatedRoute, private loaderService: LoaderService,
    private confirmationService: ConfirmationService,private findWorkService:StageStorage,  private cdRef:ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.findWorkPopoverMessage='Please complete your Profile.';
    this.titleState = 'visible';
    // this.proposalPopoverMessage='Please complete your My Profile.';
    // this.projectPopoverMessage='Please complete your My Profile.';


    this.findWorkService.getAvailabilityDetails().subscribe((emp)=>{
      if(!emp.is_completed){
        this.router.navigate(['./employee/account/profile']);
      }
      else{
        this.titleState = 'visible';
      }
    });
   
  }
  myProfile(popover: NgbPopover)
  {
    
    this.loaderService.loaderStatus.next(true);
   this.router.navigate(['account/profile'], {relativeTo: this.route.parent});

  }
  findWork(popover: NgbPopover)
  {
    // this.router.navigate(['account'], {relativeTo: this.route.parent})

    this.findWorkService.getAvailabilityDetails().subscribe((emp)=>{
      // if(!emp.is_completed){       
      //   this.router.navigate(['./employee/account/profile']);
      // }
      // else{
      //   popover.open();             
      // }
      emp.is_completed ? this.router.navigate(['account'], {relativeTo: this.route.parent}) : popover.open();
    },
    (error) => {
     this.titleState = 'visible';
      console.log(error);
    });
   
  }
  projectList(popover: NgbPopover)
  {
    //this.router.navigate(['account/project-list'], {relativeTo: this.route.parent})
    this.findWorkService.getAvailabilityDetails().subscribe((emp)=>{
         emp.is_completed ? this.router.navigate(['account/project-list'], {relativeTo: this.route.parent}) : popover.open();
    },
    (error) => {
     this.titleState = 'visible';
      console.log(error);
    });
  }
  proposalList(popover: NgbPopover)
  {
    //this.router.navigate(['account/my-proposals'], {relativeTo: this.route.parent})
    this.findWorkService.getAvailabilityDetails().subscribe((emp)=>{
    
      emp.is_completed ? this.router.navigate(['account/my-proposals'], {relativeTo: this.route.parent}) : popover.open();
    },
    (error) => {
     this.titleState = 'visible';
      console.log(error);
    });
  }
  // newIdea() {
  //   if (this.isNewIdeaLoading) {
  //     return;
  //   }
  //   this.isNewIdeaLoading = true;
  //   this.buttonState1 = 'disabled';
  //   this.router
  //     .navigate(['idea/realization', {method: 'new'}], {relativeTo: this.route.parent})
  //     .catch(() => {
  //       this.isNewIdeaLoading = false;
  //       this.buttonState1 = 'visible';
  //   });
  // }  

  animationDone(event) {
    if (event.toState === 'visible') {
      if (event.triggerName === 'titleState') {
        this.buttonState1 = 'visible';
      } else if (event.triggerName === 'buttonState1') {
        this.buttonState2 = 'visible';
      } else if (event.triggerName === 'buttonState2') {
        this.buttonState3 = 'visible';
      } else if (event.triggerName === 'buttonState3') {
        this.buttonState4 = 'visible';
      }
    }
  }
  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName): void {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }
  ngAfterViewChecked()
  {   
    this.cdRef.detectChanges();
  }
}
