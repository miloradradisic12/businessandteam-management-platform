import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';
import { LoaderService } from 'app/loader.service';


/**
 * Service for communicating with REST API
 */
@Injectable()
export class ApiService {
  constructor(private authHttp: AuthHttp, private http: Http, private loaderService: LoaderService) {
  }

  /**
   * Get server resource.
   *
   * @param path - resource path
   * @param params - query params (path?param1=value1&param2=value2)
   * @returns observable of T
   */
  get<T>(path: string, params = {},headers?:Headers): Observable<T> {
    if (path.indexOf('answers') < 0 && path.indexOf('autocomplite') < 0 && path.indexOf('chat/user/profile')) {
      this.loaderService.loaderStatus.next(true);
    }
    const options = <RequestOptionsArgs>{
      params: params
    };
    if(headers){
      options.headers = headers;
    }
    
    return this.authHttp.get(`${environment.server}/${path}/`, options)
      .map((response: Response): T => { this.loaderService.loaderStatus.next(false); return response.json(); })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Create server resource.
   *
   * @param path
   * @param data
   * @returns observable of T
   */
  post<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0) {
      this.loaderService.loaderStatus.next(true);
    }
    return this.authHttp.post(`${environment.server}/${path}/`, data)
      .map((r: Response) => { this.loaderService.loaderStatus.next(false); return r.json() as OutT; })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Partially update server resource.
   * @param path
   * @param data
   * @returns observable of T
   */
  patch<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0) {
      this.loaderService.loaderStatus.next(true);
    }
    // this.loaderService.loaderStatus.next(true);
    return this.authHttp.patch(`${environment.server}/${path}/`, data)
      .map((r: Response) => { this.loaderService.loaderStatus.next(false); return r.json() as OutT; })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Update server resource.
   * @param path
   * @param data
   * @returns observable of T
   */
  put<InT, OutT>(path: string, data: InT): Observable<OutT> {
    if (path.indexOf('answers') < 0) {
      this.loaderService.loaderStatus.next(true);
    } return this.authHttp.put(`${environment.server}/${path}/`, data)
      .map((r: Response) => { this.loaderService.loaderStatus.next(false); return r.json() as OutT; })
      .catch(err => this.handleError(err, this.loaderService));
  }

  /**
   * Delete server resource.
   *
   * @param path
   * @returns observable of T
   */
  delete(path) {
    if (path.indexOf('answers') < 0) {
      this.loaderService.loaderStatus.next(true);
    } return this.authHttp.delete(`${environment.server}/${path}/`)
      .map((r: Response) => { this.loaderService.loaderStatus.next(false); return r.json(); })
      .catch(err => this.handleError(err, this.loaderService));
  }


  protected handleError(error: any, loaderService: LoaderService) {
    loaderService.loaderStatus.next(false);
    const errorJson = error.json();
    const errorMsg = errorJson || error;
    return Observable.throw(errorMsg);
  }
}
