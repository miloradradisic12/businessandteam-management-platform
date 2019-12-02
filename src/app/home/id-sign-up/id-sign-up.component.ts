import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { WebCamComponent } from 'ack-angular-webcam';

@Component({
  selector: 'app-id-sign-up',
  templateUrl: './id-sign-up.component.html',
  styleUrls: [
    '../login/login.component.scss',
    './id-sign-up.component.scss',
    './id-sign-up.component.css'
  ],
})
export class IdSignUpComponent implements OnInit {
  flagPassportID: boolean = false;

  private profile: UserProfileModel;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.profile = new UserProfileModel();
  }

  ngOnInit() {

  }

  updateDropTemplate() {
    if (this.profile.passport_photo) {
      this.flagPassportID = true;
    }
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event,document:string) {
    this.profile[document] = $event.src;
    this.updateDropTemplate();
  }
}