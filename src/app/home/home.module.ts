import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {environment} from 'environments/environment';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SelectRoleComponent } from './select-role/select-role.component';
import { SocialComponent } from './login/social/social.component';
import { HomeRoutingModule } from './home.routing';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { LogoutComponent } from './logout/logout.component';
import {MyPrimeNgModule} from '../my-prime-ng.module';
import {TermsOfUseContent} from './terms-of-use/terms-of-use.component';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from './login/ng4-social-login';

import { PasswordUpdatedComponent } from './password-updated/password-updated.component';
import { ForgotComponent } from './forgot/forgot.component';
import { IdSignUpComponent } from './id-sign-up/id-sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FileDroppa } from 'file-droppa/lib/index';
import { NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleProviderKey)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebookProviderKey)
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider(environment.linkedinProviderKey)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppElementsModule,
    HomeRoutingModule,
    NavbarModule,
    FileDroppa,
    NgbTypeaheadModule,
    NgbPopoverModule,
    AppElementsModule,
    SharedModule,
    MyPrimeNgModule],
  declarations: [
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SelectRoleComponent,
    SocialComponent,
    LogoutComponent,
    IdSignUpComponent,
    ForgotComponent,
    ResetPasswordComponent,
    PasswordUpdatedComponent,
    IdSignUpComponent,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class HomeModule { }
