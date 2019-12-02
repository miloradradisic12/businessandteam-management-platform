import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import { AccountService } from '../account.service';
import { AuthService } from 'app/auth/auth.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import Roles from 'app/core/models/Roles.enum';
import { ProfileEditSession } from './ProfileEditSession';
import { FirstLastNameErrors } from './form-errors';
import { ChangePasswordModel } from 'app/core/models/ChangePasswordModel';
import { debug } from 'util';
import { LoaderService } from 'app/loader.service';
import {SelectItem} from 'primeng/primeng';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditAccountComponent implements OnInit {
  @ViewChild('f') public userFrm: NgForm;

  private profile: UserProfileModel;
  private objChangePassword: ChangePasswordModel;
  // private userRoles;

  profileErrors: object;
  isTemporaryUser: boolean;
  messages: any;
  
  fields = null;

  popoverTimerList = {};

  searching = false;
  searchFailed = false;
  changeEmail = true;
  changePhone = true;
  changeUsername = true;

  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  flagShowPassword: boolean = false;

  // flagPasswordReq: boolean = false;
  // flagOldPassword: boolean = false;
  // flagPasswordMismach: boolean = false;
  // flagOldPasswordReq: boolean = false;
  notImplementedMessage: string;
  userRoles: SelectItem[];

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private profileEditSession: ProfileEditSession,
    private router: Router,
    private formBuilder: FormBuilder, private loaderService: LoaderService
  ) {
    this.isTemporaryUser = authService.isTemporaryUser();
    this.profile = new UserProfileModel();
    this.profileErrors = {};
    this.userRoles = [];
    this.objChangePassword = new ChangePasswordModel();
    this.notImplementedMessage = 'This features are not yet implemented';
    _.values(Roles).forEach(e => {
      this.userRoles.push({
        label: e, value: e
      });
    });
  }

  ngOnInit() {
    this.messages = new FirstLastNameErrors();
    Object.keys(this.userFrm.controls).forEach((control) => {
      this.userFrm.controls[control].setErrors(null);
    });
    this.loadProfile();
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event,document:string) {
    this.profile[document] = $event.src;
  }

  submitForm(event) {
    this.userFrm.ngSubmit.emit();
    if (this.userFrm.valid) {
      this.saveUser(event);
    } else {
      this.fields = this.userFrm.controls;
    }
  }


  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: any) {
    const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  loadProfile(): void {
    this.profileEditSession.getUser()
      .subscribe(
        (userProfile: UserProfileModel) => {
          this.profile = userProfile;
          this.changeEmail = !!userProfile.email;
          this.changePhone = !!userProfile.phone_number;
          this.changeUsername = !!userProfile.user_name;
          this.loaderService.loaderStatus.next(false);
        },
        (errorMsg: any) => {
          console.log(errorMsg);
          this.loaderService.loaderStatus.next(false);
        }
      );
  }

  saveUser(event): void {
    this.loaderService.loaderStatus.next(true);
    this.accountService.checkPhoneIsValid(this.profile.phone_number).subscribe((obj) => {
      if (obj.valid) {
        this.accountService.updateProfile(this.profile)
          .subscribe(
            () => {
              this.loaderService.loaderStatus.next(false);
              // FIXME: fix static route
              this.router.navigate(['/founder/account']);
            },
            (errorMsg: any) => {
              this.loaderService.loaderStatus.next(false);
              console.log(errorMsg);
              this.checkForErrors(errorMsg);
              this.profileErrors = errorMsg;
            });
      }
      else {
        let errorMsg = { 'phone_number': ['Enter a valid phone number.'] };
        this.checkForErrors(errorMsg);
        this.profileErrors = errorMsg;
      }
    });

  }

  selectAddress(event) {
    event.preventDefault();
    this.profile.address = event.item.address;
  }

  addressFormatter = (result: object) => result['address'];

  searchAddress = (text$: Observable<string>) => {
    return text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.accountService.getAddress(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  }

  removeID(ID: string) {
    //to delete uploaded ID/Photo
    if (ID == 'passport_photo') {
      this.profile.passport_photo = '';
    }
    if (ID == 'driver_license_photo') {
      this.profile.driver_license_photo = '';
    }
  }

  showChangePassword() {
    this.flagShowPassword = true;
  }

  changePassword() {
    this.loaderService.loaderStatus.next(true);
    this.objChangePassword.id = this.profile.id;
    this.accountService.changePassword(this.objChangePassword)
      .subscribe(
        (response: string) => {
          this.flagShowPassword = false;
          this.declinePassword();
          this.loaderService.loaderStatus.next(false);
        },
        (errMsg: any) => {
          this.profileErrors = errMsg;
          console.log(errMsg);
          this.loaderService.loaderStatus.next(false);
        }
      );
  }

  removeErrors(key) {
    //const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  declinePassword() {
    this.removeErrors('new_password1');
    this.removeErrors('new_password2');
    this.removeErrors('old_password');
    this.objChangePassword = new ChangePasswordModel();
    this.flagShowPassword = false;

    // this.flagOldPassword = false;
    // this.flagOldPasswordReq = false;
    // this.flagPasswordReq = false;
    // this.flagPasswordMismach = false;
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.userFrm.controls[err] ? this.userFrm.controls[err].setErrors(newErr)
        : this.userFrm.controls['common'].setErrors(newErr);
      console.log(this.userFrm.controls[err].errors[err]);
    });
  }

  closePopoverpWithDelayWallet(timer: number, popoverId: NgbPopover, timerName): void {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }
  
  walletshow(){
    this.router.navigate(['/founder/wallet']);
  }
}
