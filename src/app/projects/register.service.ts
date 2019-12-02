import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {ApiService} from 'app/core/api/api.service';
import {HasId} from 'app/core/interfaces';
import ProjectModel from 'app/projects/models/ProjectModel';
import RegistrationPackageModel from './models/RegistrationPackageModel';

/**
 * Project Register Service
 * Service provides functions for project registration
 */
@Injectable()
export class ProjectRegisterService{
    constructor(private api: ApiService) {
    }

  /**
   * Get registration entities list
   *
   * @returns list of entity types
   */
  getEntityList(): Observable<{id:number,title:string,amount:number,description:string}[]> {
    return this.api.get<{id:number,title:string,amount:number,description:string}[]>('registration/registration_type');
  }

  getEntity(id:number):Observable<{id:number,title:string,amount:number,description:string}>{
    return this.api.get<{id:number,title:string,amount:number,description:string}>(`registration/registration_type/${id}`);
  }

  /**
   * Get project Registration Packages
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getRegistrationPackages(entityType: number): Observable<RegistrationPackageModel[]> {
    return this.api.get<RegistrationPackageModel[]>( `registration/registration_type/${entityType}/packages`);
  }

  /**
   * Get Registration with the searched text
   *
   * @param searchText - searchText
   * @returns company registered which is in USA with same name data (list)
   */
  getRegistrationCompany(searchText): Observable<any> {
    return this.api.get<any>( `company/search`, {company: searchText});
  }
}