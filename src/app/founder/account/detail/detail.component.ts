import { Component, OnInit } from '@angular/core';

import {AccountService} from '../account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {UserProfile} from 'app/core/interfaces';
import { LoaderService } from 'app/loader.service';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class ViewAccountComponent implements OnInit {
  private profile: UserProfile;

  constructor(
    private accountService: AccountService,
    private loaderService: LoaderService
  ) {
    this.profile = new UserProfileModel();
  }

  ngOnInit() {
     this.loadProfile();
  }

  loadProfile() {
    this.accountService.getProfile()
      .subscribe(
        (userProfile) => {
          this.profile = userProfile;
          this.loaderService.loaderStatus.next(false);
        },
        (errorMsg: any) => {
          console.log(errorMsg);
          this.loaderService.loaderStatus.next(false);
        }
      );
  }
}
