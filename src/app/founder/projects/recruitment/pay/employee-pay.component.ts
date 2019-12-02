import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { NgbRatingConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import { PaymentService } from "app/projects/payment.service";
import EmployeePaymentDetails from "app/projects/models/EmployeePaymentDetails";
import { CustomValidators } from "app/core/custom-form-validator";
import EmployeePayModel from "app/projects/models/EmployeePayModel";
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
    templateUrl:'./employee-pay.component.html',
    styleUrls:['./employee-pay.component.scss'],
    providers:[NgbRatingConfig,PaginationMethods]
})
export class EmployeePay implements OnInit{
    projectId:number;
    employeeId:number;
    employeePaymentDetails:EmployeePaymentDetails;
    pay:EmployeePayModel;
    errorMessages:any = [];

    pageSize = 10;
    amountToBePaid:number = 0;

    frmEmployeePay: FormGroup;
    frmEmployeeHours: FormGroup;

    fromDate:FormControl;
    tillDate:FormControl;
    hourlyRate:FormControl;
    loggedInHours:FormControl;
    bonus:FormControl;
    deductions:FormControl;
    amount:FormControl;

    constructor(
        private route:ActivatedRoute,
        private paymentService:PaymentService,
        config: NgbRatingConfig,
        private fb: FormBuilder,
        private _location: Location
    ){
        config.max = 5;
        config.readonly = true;
        this.employeePaymentDetails = new EmployeePaymentDetails();
        this.pay = new EmployeePayModel();
    }
    
    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.employeeId = params['empid'];
            this.pay.project = this.projectId;
            this.getCurrentEmployeePayDetails(0);            
          });

        this.fromDate = new FormControl('', Validators.required);
        this.tillDate = new FormControl('', Validators.required);
        this.hourlyRate= new FormControl('', [Validators.required, CustomValidators.numeric]);
        this.loggedInHours= new FormControl('', [Validators.required]);
        this.bonus= new FormControl('', [CustomValidators.numeric]);
        this.deductions= new FormControl('', [CustomValidators.numeric]);
        this.amount= new FormControl('', [Validators.required, CustomValidators.numeric]);

        this.frmEmployeeHours = this.fb.group({
            fromDate : this.fromDate,
            tillDate: this.tillDate,
        });
        this.frmEmployeePay = this.fb.group({
            hourlyRate: this.hourlyRate,
            loggedInHours: this.loggedInHours,
            bonus:this.bonus,
            deductions:this.deductions,
            amount:this.amount
        });
      }

      getCurrentEmployeePayDetails(newPage){
        this.paymentService.getCurrentEmployeePayDetails(this.employeeId, this.projectId.toString(),newPage, this.pageSize).subscribe((data)=>{
            console.log('pay details data');
            console.log(data);
            this.employeePaymentDetails = data;
            this.pay.hourly_rate = data.hourly_rate;
        });  
      }

      getLoggedInHours(){
        if(this.frmEmployeeHours.valid){
            this.paymentService.getLoggedInHours(this.employeeId, this.pay).subscribe((data)=>{
                this.pay.loggedin_hours = data.hours;
                this.pay.amount.amount = data.amount;
                this.amountToBePaid = data.amount;
                this.pay.hourly_rate = this.employeePaymentDetails.hourly_rate;
                console.log('logged in hours');
                console.log(data);
            },(error)=>{
                this.errorMessages = error;
                setTimeout(() => {
                  this.errorMessages = [];
                }, 4000);
              }
            );   
        }
        else{
            this.validateAllFormFields(this.frmEmployeeHours);
        }
      }

      clearLoggedInHours(){
        this.pay.loggedin_hours = null;
        this.pay.amount.amount = null;
      }

      calculateAmount(){
        let bonus = 0;
        let deductions = 0;
        let amount = this.amountToBePaid;

        if(this.pay.bonus && this.pay.bonus.amount){
            bonus = this.pay.bonus.amount;
        }
        if(this.pay.deductions && this.pay.deductions.amount){
            deductions = this.pay.deductions.amount;
        }
        amount = +amount + +(bonus - deductions);
        this.pay.amount.amount = amount;
      }

      clear(){
          this.frmEmployeeHours.reset();
          this.frmEmployeePay.reset();
      }

      submit(){
          if(!this.frmEmployeeHours.valid){
            this.validateAllFormFields(this.frmEmployeeHours);
            return;
          }
        if(this.frmEmployeePay.valid){
            if(this.pay.amount.amount<=0){
                this.errorMessages.push('Paying amount should be greater than zero.');
                setTimeout(() => {
                    this.errorMessages = [];
                  }, 4000);
                return;
            }
            this.paymentService.savePayment(this.employeeId, this.pay).subscribe((data)=>{
                console.log('payment saved');
                console.log(data);
                this.getCurrentEmployeePayDetails(0);
            },(error)=>{
                this.errorMessages = error;
                setTimeout(() => {
                  this.errorMessages = [];
                }, 4000);
              }
        );
        }
        else{
            this.validateAllFormFields(this.frmEmployeePay);
        }
      }

      validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
}