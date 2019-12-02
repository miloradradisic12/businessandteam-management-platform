import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {AuthStrategy} from './interfaces';
import {TokenAuthStrategy} from './TokenAuthStrategy';
import {TemporaryUserAuthStrategy} from './temporary-user/TemporaryUserAuthStrategy';
import {AccountService} from 'app/founder/account/account.service';


/**
 * Authentication service
 * Service provides functions for storage user authentication state
 */
@Injectable()
export class AuthService {
  loginEvent: Subject<any>;
  logoutEvent: Subject<any>;
  private strategy: AuthStrategy;

  constructor(
    private tokenAuthStrategy: TokenAuthStrategy,
    private temporaryUserAuthStrategy: TemporaryUserAuthStrategy,
    private router: Router,
    private accountService: AccountService
  ) {
    this.loginEvent = new Subject();
    this.logoutEvent = new Subject();
  }

  /**
   * Remember user with token
   *
   * @param token
   */
  login(token: any) {
    this.strategy = this.tokenAuthStrategy;
    this.strategy.login({token: token});
    this.loginEvent.next();
    this.accountService.clearProfileCache();
  }

  /**
   * Remember temporary user with token
   *
   * @param token
   */
  loginTemporary(token: string) {
    this.strategy = this.temporaryUserAuthStrategy;
    this.strategy.login({token: token});
    this.loginEvent.next();
    this.accountService.clearProfileCache();
  }

  /**
   * Logout user and triggers logoutEvent
   */
  logout() {
    if (this.strategy) {
      this.strategy.logout();
    }
    this.logoutEvent.next();
    this.router.navigateByUrl('/login');
    this.accountService.clearProfileCache();
  }

  /**
   * Check user is authenticated
   *
   * @returns {boolean}
   */
  loggedIn(): boolean {
    if (this.strategy) {
      return this.strategy.isLoggedIn();
    }

    for (const strategy of [
      this.temporaryUserAuthStrategy,
      this.tokenAuthStrategy,
    ]) {
      if (strategy.isLoggedIn()) {
        this.strategy = strategy;
        return true;
      }
    }

    return false;
  }

  /**
   * Check user is temporary
   *
   * @returns {boolean}
   */
  isTemporaryUser(): boolean {
    return this.strategy === this.temporaryUserAuthStrategy;
  }
}
