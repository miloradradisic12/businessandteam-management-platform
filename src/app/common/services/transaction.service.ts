import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { TransactionModel } from '../models/transaction-model';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class TransactionService {

  constructor(private api: ApiService) { }

  getTransactionList(startPage?, pageSize?, stage?, search?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('user/transaction-list', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<any[]>('user/transaction-list');
  }

  getCurrencyForSelectedBank(bank): Observable<string> {
    return this.api.get<string>(`user/bank-accounts/${bank}`);
  }

  postTransaction(transactionInfo: TransactionModel): Observable<TransactionModel>{
    return this.api.post('transactions', transactionInfo);
  }

  /*putTransaction<T extends HasId>(transactionInfo: T): Observable<TransactionModel>{
    return this.api.put<T, TransactionModel>(`transactions/${transactionInfo.id}`, transactionInfo);
  }

  deleteTransaction<T extends HasId>(transactionInfo: T): Observable<any> {
    return this.api.delete(`transactions/${transactionInfo.id}`);
  }*/

}
