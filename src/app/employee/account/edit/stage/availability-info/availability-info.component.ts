import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import {EmployeeAvailabilityInfo} from 'app/employeeprofile/models/employee-availability-info';
import {ListingData,SelectItem} from 'app/employeeprofile/models/employee-professional-info'; 
import {Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-availability-info',
  templateUrl: './availability-info.component.html',
  styleUrls: ['./availability-info.component.scss']
})
export class AvailabilityInfoComponent implements OnInit {
  complexForm: FormGroup;
  messages: any;
  fields = null;
  private availabilityInfo:EmployeeAvailabilityInfo;
  daysPerYearList:SelectItem[];      //ListingData[];
  objHoursPerDay:SelectItem[];//=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  hoursPerDay:SelectItem[];
  hourly_chargesList:SelectItem[];
  processing = false;
  
  constructor(fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, private stageStorage:StageStorage,
    private loaderService: LoaderService) {
    this.availabilityInfo=new EmployeeAvailabilityInfo();
    this.complexForm = fb.group({
     'daysPerYear': [''],
      'hoursPerDay': [''],      
      'hourly_charges': [''],   
    });
  }

  ngOnInit() {
    this.loaderService.loaderStatus.next(true);
    this.stageStorage.getAvailabilityDetails().subscribe(
      (obj: EmployeeAvailabilityInfo) => {   
        if(obj!=undefined)
        {
          this.availabilityInfo=obj;           
        }
        else{
          this.availabilityInfo=new EmployeeAvailabilityInfo();
        }
        this.setValues();   
        this.loaderService.loaderStatus.next(false);
      },
      (errorMsg: any) => {
        this.loaderService.loaderStatus.next(false);
        console.log(errorMsg);
      }
    );
    
   
    this.stageStorage.getDaysPerYearList().subscribe(
      (obj: ListingData[]) => {    
        this.daysPerYearList=[];
        obj.forEach(e=>{          
          this.daysPerYearList.push({
            id: e.id, label: e.title, value: e.id          
          });
        });       
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );    

    this.stageStorage.getHourlyBudgetList().subscribe(
      (obj: ListingData[]) => {    
        this.hourly_chargesList=[];
        obj.forEach(e=>{
          
          this.hourly_chargesList.push({
            id: e.id, label: e.title, value: e.id          
          });
        });
       
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );

    //set hoursPerDay
    this.stageStorage.getAllAvailability().subscribe(
      (obj: ListingData[]) => {    
        this.hoursPerDay=[];
        obj.forEach(e=>{
          
          this.hoursPerDay.push({
            id: e.id, label: e.title, value: e.id          
          });
        });
       
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
   
  }
  setValues()
  {
    this.complexForm.setValue({
      'daysPerYear':this.availabilityInfo.days_per_year,
      'hoursPerDay': this.availabilityInfo.hours_per_day,
      'hourly_charges':this.availabilityInfo.hourly_charges    
    })
  }

  onDaysYearSelect(_Id)
  {    
    for (var i = 0; i < this.daysPerYearList.length; i++)
    {
      if (this.daysPerYearList[i].id == _Id) {
        this.availabilityInfo.days_per_year=_Id;
      }
    }    
  }

  onHoursDaySelect(_Id)
  {    
    for (var i = 0; i < this.hoursPerDay.length; i++)
    {
      if (this.hoursPerDay[i] == _Id) {
        this.availabilityInfo.hours_per_day=_Id;
      }
    }    
  }

  submitAvailabilityInfo(value: any) {
    this.processing=true;
    this.loaderService.loaderStatus.next(true);
    if(this.complexForm.valid)
    {  
    this.availabilityInfo.days_per_year=value.daysPerYear;
    this.availabilityInfo.hours_per_day=value.hoursPerDay;
    this.availabilityInfo.hourly_charges=value.hourly_charges;
    this.availabilityInfo.is_completed = true;
    this.stageStorage.putAvailabilityInfo(this.availabilityInfo).subscribe((obj)=>{
        this.stageStorage.setAvailabilityInfo(this.availabilityInfo);
        this.processing=false;
        this.loaderService.loaderStatus.next(false);
      this.router.navigate(['../../'], {relativeTo: this.route});
    }    ,
    (errorMsg: any) => {
      this.loaderService.loaderStatus.next(false);
      this.processing=false;
      console.log(errorMsg);
    });
  }

else{
  this.loaderService.loaderStatus.next(false);
  this.processing=false;
  console.log("validation falied");
  this.validateAllFormFields(this.complexForm);
}
}

validateAllFormFields(formGroup: FormGroup) {         
Object.keys(formGroup.controls).forEach(field => {  
const control = formGroup.get(field);   
control.markAsTouched({ onlySelf: true });         
});
}

checkForErrors(errorMsg) {
let newErr = {};
Object.keys(errorMsg).forEach((err) => {
newErr[err] = true;
this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
  : this.complexForm.controls['common'].setErrors(newErr);

  console.log(this.complexForm.controls[err].errors[err]);
});

}
}