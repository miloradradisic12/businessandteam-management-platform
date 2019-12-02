import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { TransactionService } from '../../../services/transaction.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccountModel } from '../../../models/bank-account-model';
import { TransactionModel } from '../../../models/transaction-model';

@Component({
  selector: 'app-deposit-withdraw-fund',
  templateUrl: './deposit-withdraw-fund.component.html',
  styleUrls: ['./deposit-withdraw-fund.component.scss']
})
export class DepositWithdrawFundComponent implements OnInit {

  @Input() selectedType;
  @Output() completedTransaction = new EventEmitter<number>();
  bankAccountInfoList: BankAccountModel[];
  bankAccountList: SelectItem[];
  bankAccountInfo: BankAccountModel;
  transactionInfo: TransactionModel;
  objKeyMessage: any;

  constructor(private transactionService: TransactionService,
    private bankAccountService: BankAccountService) {
    this.bankAccountInfoList = [];
    this.bankAccountInfo = new BankAccountModel();
    this.transactionInfo = new TransactionModel();
    this.bankAccountList = [];
  }

  ngOnInit() {
    this.bankAccountService.getBankAccounts().subscribe((bankAccounts) => {
      this.bankAccountInfoList = bankAccounts;
      this.setDefaultBank();
      this.bankAccountInfoList.forEach(value => {
        this.bankAccountList.push({ label: value.bank_name, value: value.id });
      });
    });
  }

  setDefaultBank() {
    this.bankAccountInfo = this.bankAccountInfoList.filter(a => a.is_default == true)[0];
    if (this.bankAccountInfo) {
      this.transactionInfo.amount.currency = this.bankAccountInfo.currency;
      this.transactionInfo.bank_account = this.bankAccountInfo.id;
    }
  }

  getSelectedBankCurrency(value) {
    this.bankAccountInfo = this.bankAccountInfoList.filter(a => a.id == value)[0];
    this.transactionInfo.amount.currency = this.bankAccountInfo.currency;
  }

  saveTransactionInfo(form) {
    this.transactionInfo.mode = this.selectedType;
    this.transactionInfo.is_external = true;
    console.log(this.transactionInfo);
    this.transactionService.postTransaction(this.transactionInfo).subscribe((objInfo) => {
      this.transactionInfo.amount.amount = 1;
      this.transactionInfo.mode = this.selectedType;
      this.transactionInfo.remark = '';
      this.setDefaultBank();
      this.completedTransaction.emit(1);
    }, (errorMsg: any) => {
      console.log(errorMsg);
      this.checkForErrors(errorMsg, form);
    });
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['non_field_errors'].setErrors(newErr);
    });
  }

}
