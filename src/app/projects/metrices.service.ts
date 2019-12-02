import { Injectable } from '@angular/core';
import { ApiService } from 'app/core/api/api.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { Headers } from '@angular/http';

import { MetricesModel } from 'app/projects/models/metrices-model';

@Injectable()
export class MetricesService {

  constructor(private api: ApiService) { }

  /**
    * Get current employee profile and it's process details on emp id.
    *
    * @returns current employee profile and it's process details
    */
  getCurrentEmployeeProfileProcess(empProfileId: number, projectId: string): Observable<any> {
    let myHeader = new Headers();
    myHeader.append('project', projectId);

    return this.api.get<any>(`recruitments/current-employee/${empProfileId}/processes`, {}, myHeader);
  }

  /**
    * Get current employee process list details on emp id.
    *
    * @returns current employee process list details
    */
  getCurrentEmployeeProcessList(empProfileId: number, projectId: string, process_id: number, startPage?, pageSize?, search?): Observable<any> {
    let myHeader = new Headers();
    myHeader.append('project', projectId);
    if (!startPage) {
      startPage = 0;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    const offset = (startPage - 1) * pageSize;
    return this.api.get<any>(`recruitments/current-employee/${empProfileId}/processes/${process_id}/metrices`, { offset: offset, limit: pageSize, search: search }, myHeader);
  }

}
