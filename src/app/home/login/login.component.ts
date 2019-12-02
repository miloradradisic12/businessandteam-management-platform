import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { LoginService, TokenResponse } from 'app/auth/login.service';
import { LoginRequest } from 'app/auth/models/LoginRequest';
import { CommonResponse } from 'app/core/api/CommonResponse';
import { AuthService } from 'app/auth/auth.service';
import { SignupService } from 'app/auth/signup.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { RoleService } from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import { TermsOfUseContent } from '../terms-of-use/terms-of-use.component';
import { LoginErrors } from './form-errors';
import { LoaderService } from 'app/loader.service';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './login.component.portrait.css'
  ],
  providers: [LoginService, SignupService]
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private callback = false;
  popUpOptions: NgbModalOptions = { backdrop: false, windowClass: 'center-position  top50', size: 'lg' };
  showOtpInput = false;
  //Testing SVN
  messages: any;
  fields = null;
  //msgs: any[] = [];
  loginMethod: SelectItem[];

  @Input() title;
  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private signupService: SignupService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {
    this.loginForm = formBuilder.group({
      method: ['email', []],
      common: ['', []],
      email: ['', []],
      phone: ['', []],
      password: ['', []],
      username: ['', []],
      otp: ['', []]
    });
    this.loginMethod = [
      {label: 'Email', value: 'email'},
      {label: 'Phone', value: 'phone'},
      {label: 'User Name', value: 'username'},
  ];
  }

  ngOnInit() {
    this.messages = new LoginErrors();
    console.log(this.messages);
    this.route.queryParams.subscribe((params: Params) => {
      const token = params['token'];
      const oauth_token = params['oauth_token'];
      const oauth_verifier = params['oauth_verifier'];
      const isPaypal = params['paypal'];
      const email = params['email'];
      const isError = params['is_error'];
      const errorMsg = params['error'];

      console.log(`ispaypal - ${isPaypal}, email - ${email}`);

      if (token) {
        this.authService.login(token);
        this.callback = true;
        this.getUserStatus();
      }
      if (isPaypal) {
        if(isError){
          //this.msgs.push({ severity: 'error', summary: 'Error', detail: errorMsg, life: 3000 });
        }
        else{
          this.getPaypalData(email);
        }        
      }
      else if (oauth_token && oauth_verifier) {
        this.getTwitterData(oauth_token, oauth_verifier);
      }
    });

    this.loginForm.valueChanges.subscribe((e) => {
      this.loginForm.controls['common'].setErrors(null);
    });
  }

  getPaypalData(email: string) {
    // console.log('yakko paypal aa gaya');
    let response = new LoginRequest();
    response.email = email;
    this.loginService.socialLogin(response)
      .subscribe(
        (response: TokenResponse) => {
          // console.log('Yakko paypal response');
          // console.log(response);
          this.authService.login(response.token);
          // TODO: get user info
          const user = {} as UserProfileModel;
          this.navigateToNext(user);
        }
      );
  }

  getTwitterData(oauth_token: string, oauth_verifier: string) {
    this.loginService.getTwitterData(oauth_token, oauth_verifier)
      .subscribe((response: LoginRequest) => {
        // console.log('Yakko user email');
        // console.log(response);
        this.loginService.socialLogin(response)
          .subscribe(
            (response: TokenResponse) => {
              // console.log('Yakko response');
              // console.log(response);
              this.authService.login(response.token);
              // TODO: get user info
              const user = {} as UserProfileModel;
              this.navigateToNext(user);
            }
          );
      });
  }

  openPrivacyPolicyModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Privacy Policy';
  }

  openTermsOfUseModal() {
    const modalRef = this.modalService.open(TermsOfUseContent, this.popUpOptions);
    modalRef.componentInstance.title = 'Terms of Use';
  }

  removeErrors(value) {
    this.fields = [];
    Object.keys(this.loginForm.controls).forEach((control) => {
      if(control!=='method'){
        this.loginForm.controls[control].patchValue('');
      }
      this.loginForm.controls[control].setErrors(null);
      //this.loginForm.controls[control].updateValue('');
      //this.loginForm.controls[control].setValue('');
    });
  }

  loginUser() {    
    this.loaderService.loaderStatus.next(true);
    this.fields = this.loginForm.controls;
    const data = this.loginForm.value;
    const loginData: LoginRequest =
      data.method === 'email' && { email: data.email, password: data.password } ||
      //data.method === 'phone' && {phone: data.phone, password: data.otp};
      data.method === 'phone' && { phone: data.phone, password: data.password } ||
      data.method === 'username' && { user_name: data.username, password: data.password };
    if (this.loginForm.valid) {
      // if(data.method==='email')
      // {
        if(data.method === 'phone') {
          this.loginService.checkPhoneIsValid(data.phone).subscribe((res)=>{
            if(!res.valid){
              this.checkForErrors({'phone':['Invalid Phone no.']});
            }
            else {
              this.getLogInToken(loginData);}
          });
        }
        else{
          this.getLogInToken(loginData);
        }
    }
    else {
      this.loaderService.loaderStatus.next(false);
     // this.msgs.push({ severity: 'error', summary: 'Something went wrong', detail: 'Sorry', life: 3000 });
    }


  }

  getLogInToken(loginData: LoginRequest){
    this.loginService.login(loginData)
        .subscribe(
          (response: TokenResponse) => {
            console.log(response);
            this.authService.login(response.token);
            // TODO: get user info
            const user = {} as UserProfileModel;
            this.navigateToNext(user);


          },
          (errorMsg: any) => {
            this.checkForErrors(errorMsg);
          }
        );
  }

  getUserStatus() {
    this.loginService.getLoginStatus().subscribe(
      (response: CommonResponse) => {
        console.log(response);
        if (response.success === true) {
          const user = response.data as UserProfileModel;
          this.navigateToNext(user);
          return;
        } else {
          const error = response.error;
          if (error.message !== undefined) {
            alert(error.message);
          }
        }
        this.callback = false;
      },
      (errorMsg: any) => {
        console.log(errorMsg);
        this.callback = false;
      }
    );
  }

  checkForErrors(errorMsg) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.loginForm.controls[err] ? this.loginForm.controls[err].setErrors(newErr)
        : this.loginForm.controls['common'].setErrors(newErr);
    });
    //this.msgs.push({ severity: 'error', summary: '  went wrong', detail: 'Sorry', life: 3000 });
    this.loaderService.loaderStatus.next(false);

  }

  navigateToNext(user: UserProfileModel) {
    // this.loaderService.loaderStatus.next(false);
    //this.msgs.push({ severity: 'success', summary: 'Login Successfully Done', detail: 'Welcome', life: 3000 });
    this.roleService.getPrimaryRole()
      .subscribe((role: Roles) => {
        if (role) {
          this.roleService.setCurrentRole(role);
         // this.loaderService.loaderStatus.next(false);
          this.router.navigate([this.roleService.getCurrentHome()]);
        } else {
          this.loaderService.loaderStatus.next(false);
          this.router.navigate(['/role']);
        }


      });
  }

  //can comment this function
  // get showLoginButton() {
  //   const method = this.loginForm.value.method;
  //   if (method === 'email') {
  //     return true;
  //   } else if (method === 'phone') {
  //     return this.showOtpInput;
  //   }
  //   return false;
  // }

  // sendCode() {
  //   this.fields = {phone: this.loginForm.controls['phone']};  ``
  //   if (!this.loginForm.controls['phone'].value) this.loginForm.controls['phone'].setErrors({required: true});
  //   const phone: string = this.loginForm.value.phone;
  //  const password: string = this.loginForm.value.password;
  //  //    this.signupService.signupWithPhone({phone})
  //   this.signupService.signupWithPhone({phone,password})
  //     .subscribe(
  //       (response: any) => {
  //         console.log(response.token);
  //         this.showOtpInput = true;
  //       },
  //       (errorMsg: any) => {
  //         console.log(errorMsg);
  //         this.checkForErrors(errorMsg);
  //       }
  //     );
  // }
}
