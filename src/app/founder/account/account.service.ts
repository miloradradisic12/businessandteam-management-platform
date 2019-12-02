import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import UserProfileModel from 'app/core/models/UserProfileModel';
import { ApiService } from 'app/core/api/api.service';
import { ChangePasswordModel } from 'app/core/models/ChangePasswordModel';
import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { environment } from 'environments/environment';
import { NotificationModel } from 'app/projects/models/notification-model';


/**
 * User profile Service
 * Service provides functions for operations with user profile data
 */
@Injectable()
export class AccountService {
  cachedProfile: UserProfileModel;
  profileUpdated: Subject<UserProfileModel> = new Subject();
  cachedNotificationCount: number;
  

  constructor(private api: ApiService,
    private http: Http) {
  }

  /**
   * Get user profile data
   *
   * @returns user profile data
   */
  getProfile(): Observable<UserProfileModel> {
    if (this.cachedProfile) {
      return Observable.of(_.cloneDeep(this.cachedProfile));
    }

    return this.api.get<UserProfileModel>('accounts/profile')
      .map((userProfile: UserProfileModel) => {
        this.cachedProfile = userProfile;
        return _.cloneDeep(userProfile);
      });
  }

  /**
   * Get employees data
   *
   * @returns employees data
   */
  getEmployees() {
    return this.api.get('accounts/profile/employees');
  }


  /**
   * Update user profile data
   *
   * @returns updated user profile data
   */
  updateProfile(userData: UserProfileModel) {
    userData.email = userData.email || undefined;
    return this.api.put('accounts/profile', userData)
      .map((userProfile: UserProfileModel) => {
        this.cachedProfile = userProfile;
        this.profileUpdated.next(this.cachedProfile);
        return userProfile;
      });
  }

  checkPhoneIsValid(phone?: string): Observable<any> {
    if (phone) {
      return this.api.get<any>('phone_verify', { phone_number: phone });
    }
    return Observable.of({ valid: true });
  }

  clearProfileCache() {
    this.cachedProfile = null;
  }

  /**
   * User projile address autocomplete
   *
   * @param term - term for autocomplete
   * @returns list of addresses
   */
  getAddress(term: string) {
    if (term === '') {
      return Observable.of([]);
    }

    return this.api.get(`places/autocomplite`, { q: term })
      .map((response) => response);
  }

  /**
 * Obtain string as a response using credentials (objChangePassword)
 *
 * @param objChangePassword - must be all fields to change password
 * @returns {Observable<R|T>}
 */
  changePassword(objChangePassword: ChangePasswordModel): Observable<string> {
    const body = JSON.stringify(objChangePassword);
    const options: RequestOptionsArgs = <RequestOptionsArgs>{};
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;

    return this.http.post(environment.server + '/password_change/', body, options)
      .map((r: Response) => r.json() as string)
      .catch(this.handleObservableError);
  }

  handleObservableError(error: any) {
    return Observable.throw(error.json().error || error.json());
  }

  getNotificationCount(): Observable<any> {
    if (this.cachedNotificationCount) {
      return Observable.of(_.cloneDeep(this.cachedNotificationCount));
    }

    return this.api.get<number>('user/count')
      .map((info: any) => {
        this.cachedNotificationCount = info.notification_count;
        return _.cloneDeep(info.notification_count);
      });
  }

  getNotificationList(): Observable<NotificationModel[]> {
    return this.api.get<NotificationModel[]>('user/notification');
  }

  markAsReadNotification(notifaication: NotificationModel): Observable<NotificationModel[]> {
    return this.api.put(`user/notification/${notifaication.id}`, notifaication)
    .map((listInfo: NotificationModel[]) => {
      return listInfo;
    });    
  }


}
