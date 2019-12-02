import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
//import * as moment from 'moment';

import { ApiService } from 'app/core/api/api.service';
//import { HasId } from 'app/core/interfaces';
import { TradingInfo } from './models/trading-model';

@Injectable()
export class TradingService {

  constructor(private api: ApiService) { }

  /**
   * Get Project Launch trading list for isx, lsx and x
   */
  list(startPage?, pageSize?, search?, tradingType?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      if (tradingType == 'lsx') {
        return this.api.get<any>('trading/launch-project-list/lsx', { offset: offset, limit: pageSize, search: search });
      }
      else if (tradingType == 'isx') {
        return this.api.get<any>('trading/launch-project-list/isx', { offset: offset, limit: pageSize, search: search });
      }
      else {
        return this.api.get<any>('trading/launch-project-list/x', { offset: offset, limit: pageSize, search: search });
      }
    }
    return this.api.get<any>('trading/launch-project-list/lsx');
  }

  /**
   * Post Ask data agianst a project
   */
  postAsk(data): Observable<any> {
    return this.api.post(`trading/asking`, data);
  }

  /**
  * Post bid data agianst a project
  */
  postBid(data): Observable<any> {
    return this.api.post(`trading/bidding`, data);
  }

}
