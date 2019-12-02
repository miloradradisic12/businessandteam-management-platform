import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  is_fund: boolean = false;
  selectedType: string = '';
  walletAmmount: number;
  constructor(private _location:Location, private transactionService: TransactionService) { }

  ngOnInit() {
    this.getTransactionList(1);
  }

  selectedFundType(fundType: string) {
    this.selectedType = fundType;
    this.is_fund = !this.is_fund;
  }

  getTransactionList(newPage) {
    if (newPage) {
     this.transactionService.getTransactionList(newPage, 5, null, null)
     .subscribe((transactionList: any) => {    
       this.walletAmmount = transactionList.wallet;
     });
    }
  }

}
