import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectsService } from 'app/projects/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import ProjectModel from 'app/projects/models/ProjectModel';
import { AskBidInfo } from 'app/projects/models/trading-model';
import { TradingService } from 'app/projects/trading.service';

@Component({
  selector: 'app-project-stock',
  templateUrl: './project-stock.component.html',
  styleUrls: ['./project-stock.component.scss'],
  providers: [
    ProjectsService
  ],
})
export class ProjectStockComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  askbidInfo: AskBidInfo;
  orderType: string;
  exchanges_type: string;
  askForm: FormGroup;
  bidForm: FormGroup;
  orderTypeList: SelectItem[] = [
    { value: 'market', label: 'Market' },
    { value: 'limit', label: 'Limit Price' }
  ];
  objKeyMessageAsk: any;
  objKeyMessageBid: any;

  constructor(
    private projectsService: ProjectsService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private askFb: FormBuilder,
    private bidFb: FormBuilder,
    private tradingService: TradingService
  ) {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.exchanges_type = this.activatedRoute.snapshot.params['pagename'];
    this.project = new ProjectModel();
    this.askbidInfo = new AskBidInfo();
    this.orderType = 'Market';

    const aPrice = askFb.group({
      amount: [''],
      currency: ['']
    });

    this.askForm = askFb.group({
      exchange_type: ['', Validators.required],
      project: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      //price: [''],
      order_type: [''],
      limit_price: aPrice
      //ask_by: ['', Validators.required]
    });

    const bPrice = bidFb.group({
      amount: [''],
      currency: ['']
    });

    this.bidForm = bidFb.group({
      exchange_type: ['', Validators.required],
      project: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      //price: [''],
      order_type: [''],
      limit_price: bPrice,
      //bid_by: ['']
    });

    // this.askForm.valueChanges.subscribe(console.log);
    // this.bidForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
    this.getProject();
    this.setAskValues();
    this.setBidValues();
  }

  getProject() {
    this.projectsService.getPublished(this.projectId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
      });
  }

  setAskValues() {
    this.askForm.setValue({
      exchange_type: this.exchanges_type,
      project: this.projectId,
      quantity: '',
      //price: [''],
      order_type: 'market',
      limit_price: {
        amount: '',
        currency: 'USD'
      }
    });
  }

  setBidValues() {
    this.bidForm.setValue({
      exchange_type: this.exchanges_type,
      project: this.projectId,
      quantity: '',
      //price: [''],
      order_type: 'market',
      limit_price: {
        amount: '',
        currency: 'USD'
      }
    });
  }

  saveAsk(frm) {
    if (frm.valid) {
      this.tradingService.postAsk(frm.value).subscribe((obj) => {
        console.log(obj);
        this.resetForm();
      },
        (errorMsg: any) => {
          this.objKeyMessageAsk = errorMsg;
          this.checkForErrors(errorMsg, frm);
        });
    }
    else {
      this.validateAllFormFields(frm);
    }
  }

  saveBid(frm) {
    if (frm.valid) {
      //console.log(value);    
      this.tradingService.postBid(frm.value).subscribe((obj) => {
        console.log(obj);
        this.resetForm();
      },
        (errorMsg: any) => {
          this.objKeyMessageBid = errorMsg;
          this.checkForErrors(errorMsg, frm);
        });
    }
    else {
      this.validateAllFormFields(frm);
    }
  }

  onChangeOrderType(event) {
    this.resetForm();
    const bidAControl = this.bidForm.controls.limit_price as FormGroup;
    const askAControl = this.askForm.controls.limit_price as FormGroup;
    if (event.value == 'limit') {
      bidAControl.controls.amount.setValidators([Validators.required, Validators.min(1)]);
      askAControl.controls.amount.setValidators([Validators.required, Validators.min(1)]);
    }
    else {
      bidAControl.controls.amount.clearValidators();
      askAControl.controls.amount.clearValidators();
    }
  }

  resetForm() {
    this.objKeyMessageBid = this.objKeyMessageAsk = undefined;
    this.bidForm.reset();
    this.askForm.reset();
    this.setAskValues();
    this.setBidValues();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });

      if (field == 'limit_price') {
        const subControl = control as FormGroup;
        Object.keys(subControl.controls).forEach(subField => {
          const controlInternal = subControl.get(subField);
          controlInternal.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  checkForErrors(errorMsg, form?: FormGroup) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr) : console.log(err);
      //: form.controls['common'].setErrors(newErr);        
    });
  }
}
