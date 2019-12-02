import {Component, ViewChild, AfterViewInit,ChangeDetectorRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from 'app/auth/auth.service';

import Role from 'app/core/models/Role';
import Roles from 'app/core/models/Roles.enum';
import {RoleService} from 'app/core/role.service';
import {AccountService} from 'app/founder/account/account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: [
    './profile-menu.component.scss'
  ]
})
export class ProfileMenuComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbPopover) popover: NgbPopover;
  notificationcount=6;
  Roles = Roles;
  role: Roles;
  name: string;
  isTemporaryUser: boolean;
  message: string;
  photo: string;
  tempPassword:string='Intelegain@123';
  internalUserProfile: UserProfileModel;

  profileUpdate:Subscription = new Subscription();
  notificationCountSub:Subscription = new Subscription();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private roleService: RoleService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private loaderService: LoaderService
  ) {
    this.role = roleService.getCurrentRole();

    this.getUserName();
    this.getNotificationCount();
    this.isTemporaryUser = this.auth.isTemporaryUser();
  }

  ngOnInit(){
    this.profileUpdate = this.accountService.profileUpdated.subscribe((user:UserProfileModel)=>{
      this.internalUserProfile = user;
      this.name = user.first_name || user.email ||user.user_name;
      this.photo = user.photo_crop;
      this.tempPassword =user.temp_password;
      this.loaderService.loaderStatus.next(false);
    });   
  }

  getUserName() {
    this.accountService.getProfile()
      .subscribe((user) => {
        this.internalUserProfile = user;
        this.name = user.first_name || user.email ||user.user_name;
        this.photo = user.photo_crop;
        this.tempPassword =user.temp_password;
        this.loaderService.loaderStatus.next(false);        
      });
  }

  openProfile() {
    this.loaderService.loaderStatus.next(true);
    this.router.navigate(['/founder/account']);
  }

  editProfile() {
    this.popover.close()
    this.router.navigate(['/founder/account/edit']);
  }

  setRole(role: Roles) {
    this.loaderService.loaderStatus.next(true);
    this.roleService.setCurrentRole(role);
    this.internalUserProfile.role = role;
    
    this.role = role;
    this.accountService.updateProfile(this.internalUserProfile)
    .subscribe(
      () => {
        this.loaderService.loaderStatus.next(false);
        this.router.navigate([this.roleService.getCurrentHome()]);
      });
  }

  signOut() {
    this.auth.logout();
  }

  ngAfterViewInit() {
    if (this.auth.isTemporaryUser()) {
      this.message = 'Please, update your personal info to save your current progress.';
      this.popover.container = 'body';
      this.popover.placement = 'bottom';
      this.popover.open();
      this.cd.detectChanges();
    }
  }

  onPopoverShown() {
    setTimeout(() => {
      this.popover.close();
    }, 5000);
  }
  goNotifications()
  {
    this.router.navigate(['/notifications']);
  }
  goChatRoom()
  {
    this.router.navigate(['/founder/projects/chat-rooms']);
  }

  getNotificationCount() {
    this.accountService.getNotificationCount().subscribe((info)=>{
      this.notificationcount = info ? info : 0;
    });
  }
}
