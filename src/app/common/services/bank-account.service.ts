import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { BankModel } from '../models/bank-model';
import { CurrencyModel } from '../models/currency-model';
import { BankAccountModel } from '../models/bank-account-model';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class BankAccountService {

  constructor(private api: ApiService) { }

  getCurrencyInfoList(): Observable<CurrencyModel[]>{
    return this.api.get<CurrencyModel[]>('currency-list');
  }

  getBankInfoList(): Observable<BankModel[]>{
    return this.api.get<BankModel[]>('bank-list');
  }

  getBankAccounts(): Observable<BankAccountModel[]>{
    return this.api.get<BankAccountModel[]>('user/bank-accounts');
  }

  postBankAccount(bankInfo: BankAccountModel): Observable<BankAccountModel>{
    return this.api.post('user/bank-accounts', bankInfo);
  }

  putBankAccount<T extends HasId>(bankInfo: T): Observable<any>{
    return this.api.put<T, any>(`user/bank-accounts/${bankInfo.id}`, bankInfo);
  }

  deleteBankAccount<T extends HasId>(bankInfo: T): Observable<any> {
    return this.api.delete(`user/bank-accounts/${bankInfo.id}`);
  }

  getAccountTypeInfoList(): Observable<any[]>{
    return this.api.get<any[]>('account-type-list');
  }

}
