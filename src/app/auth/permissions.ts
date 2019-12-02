import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {LoginService, TokenResponse} from 'app/auth/login.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {RoleService} from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';
import {MessagingService} from 'app/core/messaging.service';


/**
 * Permission that indicate user is authenticated.
 */
@Injectable()
export class IsAuthenticated implements CanActivate {
  message;

  constructor(private auth: AuthService, private router: Router, private msgService: MessagingService) {}

  canActivate() {
    if (this.auth.loggedIn()) {
      this.msgService.getPermission();
      this.msgService.receiveMessage();
      this.message = this.msgService.currentMessage

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}


/**
 * Permission that indicate user is not temporary.
 */
@Injectable()
export class IsRegularUser implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (this.auth.isTemporaryUser()) {
      this.router.navigate(['/founder/account/edit']);
      return false;
    } else {
      return true;
    }
  }
}


/**
 * Permission that checks user can be authenticated using OAuth access token.
 */
@Injectable()
export class AccessTokenCheck implements CanActivate {
  constructor(
    private auth: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate() {
    const tokenMatch = window.location.href.match(/access_token=(\w+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      /*this.loginService.socialLogin(token)
        .subscribe(
          (response: TokenResponse) => {
            console.log(response);
            this.auth.login(response.token);
            // TODO: get user info
            const user = {} as UserProfileModel;
            this.router.navigate(['/founder']);
          },
          (errorMsg: any) => {
            this.router.navigate(['/login']);
          }
        );*/
    }
    return true;
  }
}


/**
 * Permission that indicate user has some role or has no role.
 */
@Injectable()
export class HasNoHome implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private loginService: LoginService,
    private roleService: RoleService
  ) {}

  canActivate() {
    if (this.auth.loggedIn()) {
      if (this.roleService.getCurrentRole()) {
        this.router.navigate([this.roleService.getCurrentHome()]);
      } else {
        this.roleService.getPrimaryRole()
          .subscribe((role: Roles) => {
            this.roleService.setCurrentRole(role);
            this.router.navigate([this.roleService.getCurrentHome()]);
          });
      }
      return false;
    }
    return true;
  }
}

// /**
//  * Permission that indicate user is not temporary.
//  */
// @Injectable()
// export class IsEmployeeProfileComplete implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate() {
//     if (this.auth.loggedIn()) {
//       this.router.navigate(['/employee/basicinfo']);
//       return true;
//     } else {
//       return false;
//     }
//   }
// }
