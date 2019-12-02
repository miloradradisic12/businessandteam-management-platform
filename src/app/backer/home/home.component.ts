import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition} from '@angular/animations';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Router, ActivatedRoute} from '@angular/router';

import {fadeAnimation} from 'app/app.animations';
import { LoaderService } from 'app/loader.service';

const fadeAppearAnimation = [
  state('visible', style({
    opacity: 1
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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('buttonMyProjects', fadeAppearAnimation),
    trigger('buttonProjects', fadeAppearAnimation),
    trigger('buttonMessages', fadeAppearAnimation),
    trigger('buttonAccount', fadeAppearAnimation),
  ]
})
export class BackerHomeComponent implements OnInit {
  buttonMyProjects: string;
  buttonProjects: string;
  buttonMessages: string;
  buttonAccount: string;
  popoverMessage: string;
  popoverTimerList = {};
  popoverFloating: string;
  _Notification: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,   private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this.loaderService.loaderStatus.next(false);
    this.buttonMyProjects = 'visible';
    this.popoverMessage = 'This feature is not yet implemented';
  }

  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName) {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }

  animationDone(event) {
    if (event.toState === 'visible') {
      if (event.triggerName === 'buttonMyProjects') {
        this.buttonProjects = 'visible';
      } else if (event.triggerName === 'buttonProjects') {
        this.buttonMessages = 'visible';
      } else if (event.triggerName === 'buttonMessages') {
        this.buttonAccount = 'visible';
      } else if (event.triggerName === 'buttonAccount') {
        this.buttonAccount = 'visible';
      }
    }
  }

  navigateTo(url) {
    this.router.navigate([url], {relativeTo: this.route});
  }
}
