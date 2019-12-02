import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BankAccountService } from '../../services/bank-account.service';
import { BankAccountModel } from '../../models/bank-account-model';
import { BankModel } from '../../models/bank-model';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {

  bankAccountInfo: BankAccountModel;
  bankAccountInfoList: BankAccountModel[];
  //bankInfoList: BankModel[];
  currencyList: SelectItem[];
  bankInfoList: SelectItem[];
  accountTypeList: SelectItem[];
  objKeyMessage: any;

  constructor(private bankAccountService: BankAccountService, private _location: Location) {
    this.bankAccountInfo = new BankAccountModel();
    this.bankAccountInfoList = [];
    //this.bankInfoList = [];
    this.bankInfoList = [];
    this.currencyList = [];
    this.accountTypeList = [];
  }

  ngOnInit() {
    this.getBankInfoList();
    this.getBankAccounts();
    this.getAccountTypes();
    this.getCurrencyList();
  }

  getBankInfoList() {
    this.bankAccountService.getBankInfoList().subscribe(bankList => {
      bankList.forEach(item => {
        this.bankInfoList.push({ label: item.title, value: item.id });
      });
    })
  }

  getBankAccounts() {
    this.bankAccountService.getBankAccounts().subscribe(bankAccounts => {
      this.bankAccountInfoList = bankAccounts;
    });
  }

  getCurrencyList() {
    this.bankAccountService.getCurrencyInfoList().subscribe(Currencys => {
      Currencys.forEach(item => {
        this.currencyList.push({ label: item.value, value: item.key });
      });
    });
  }

  saveBankInfo(form) {
    this.bankAccountInfo.is_default = this.bankAccountInfo.is_default && this.bankAccountInfo.is_default != null ? this.bankAccountInfo.is_default : false;    
    if (this.bankAccountInfo.id && this.bankAccountInfo.id != 0) {
      this.bankAccountService.putBankAccount(this.bankAccountInfo).subscribe((bankInfo) => {
        
        this.getBankAccounts();
        form.resetForm();
      }, (errorMsg: any) => {
        this.checkForErrors(errorMsg, form);
      });
    }
    else {
      this.bankAccountService.postBankAccount(this.bankAccountInfo).subscribe((bankInfo) => {
        
        this.getBankAccounts();
        form.resetForm();
      }, (errorMsg: any) => {
        this.checkForErrors(errorMsg, form);
      });
    }
  }

  editBankAccount(item: BankAccountModel) {
    this.bankAccountInfo = Object.assign({}, item);
  }

  deleteBankAccount(item) {
    this.bankAccountService.deleteBankAccount(item).subscribe((bankInfo) => {
      
      this.getBankAccounts();
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg);
    });
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['common'].setErrors(newErr);

      //console.log(err);

    });
  }

  getAccountTypes() {
    this.bankAccountService.getAccountTypeInfoList().subscribe(AccountTypes => {
      AccountTypes.forEach(item => {
        this.accountTypeList.push({ label: item.value, value: item.key });
      });
    });
  }

}
