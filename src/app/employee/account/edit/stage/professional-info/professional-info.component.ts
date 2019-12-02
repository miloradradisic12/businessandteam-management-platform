import { Component, OnInit } from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import {EmployeeProfessionalInfo,ListingData,ResumeDetail} from 'app/employeeprofile/models/employee-professional-info';  //'../employeeprofile/models/employee-professional-info';
import {SelectItem} from 'app/employeeprofile/models/employee-professional-info';
import * as moment from 'moment';
import {DropdownModule,CalendarModule,MultiSelectModule,ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
import {Router,ActivatedRoute} from '@angular/router';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.scss']
})
export class ProfessionalInfoComponent implements OnInit {
  dropZonePassportTemplate: string;
  flagResume:boolean=false;
  professionalInfo:EmployeeProfessionalInfo;
  arrayProfessionalInfo:EmployeeProfessionalInfo[]=[];

  highestQualificationList:SelectItem[]; 
  campusList:SelectItem[];
  programList:SelectItem[];
  universityList:SelectItem[];
 complexForm: FormGroup;
 flagOtherUniversity:boolean=false;
 flagOtherCampus:boolean=false;
 resumeRow:string='';
 flagToDate:boolean=false;
 flagFromDate:boolean=false;
resumeDetail:ResumeDetail;
processing = false;

  constructor(fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage:StageStorage,
    private confirmationService: ConfirmationService,
    private loaderService: LoaderService
  ) { 
this.professionalInfo=new EmployeeProfessionalInfo();
this.resumeDetail=new ResumeDetail();
    this.dropZonePassportTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.complexForm = fb.group({
      'id':[''],
      'tempId':[''],
      'highest_qualification': [],
      'programs':[],
      'campus': [], 
      'other_campus':[''] ,
      'university': [],   
      'other_university':[''],
      'from_date':['', [Validators.required]],     
      'to_date':['', [Validators.required]],
      'present': ['']
    });
   
  }

  ngOnInit() {   
    this.loaderService.loaderStatus.next(true);
    this.stageStorage.getResume().subscribe(
      (obj:ResumeDetail)=>{
        this.loaderService.loaderStatus.next(false);
        if(obj.resume!=null)
        {
          this.resumeDetail.resume=obj.resume;
          this.updateDropTemplate(obj.file_name);
        }
      },
        (errorMsg: any) => {
          this.loaderService.loaderStatus.next(false);
          console.log(errorMsg);
        }   );


    this.stageStorage.getProfessionalInfo().subscribe(
      (obj: EmployeeProfessionalInfo[]) => {
        this.loaderService.loaderStatus.next(false);    
        if(obj!=undefined && obj.length>0)
        {
          this.arrayProfessionalInfo=obj;   
      
        }
        else{
          this.arrayProfessionalInfo=[];
        }
        this.setValues();   
      },
      (errorMsg: any) => {
        this.loaderService.loaderStatus.next(false);
        console.log(errorMsg);
      }
    );

    this.stageStorage.getHighestQualification().subscribe(
      (obj: ListingData[]) => {    
        this.highestQualificationList=[];
        obj.forEach(e=>{
          
          this.highestQualificationList.push({
            id: e.id, label: e.title, value: e.id          
          });
        });
       
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );

      
    this.stageStorage.getUniversityList().subscribe(
      (obj: ListingData[]) => {  
        this.universityList=[];
        obj.forEach(e=>{
          
          this.universityList.push({
            id: e.id, label: e.title, value: e.id          
          });
        });
       
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
 
  }
getCampusList(u_Id)
{
  this.stageStorage.getCampusList(u_Id).subscribe(
    (obj: ListingData[]) => {  
      this.campusList=[];
      obj.forEach(e=>{
        
        this.campusList.push({
          id: e.id, label: e.title, value: e.id          
        });
      });
      this.loaderService.loaderStatus.next(false);
    },
    (errorMsg: any) => {
      this.loaderService.loaderStatus.next(false);
      console.log(errorMsg);
    }
  );
}

  getProgramList(q_Id)
  {
    this.stageStorage.getProgramList(q_Id).subscribe(
      (obj: ListingData[]) => {
        this.loaderService.loaderStatus.next(false);   
        this.programList=[];
        obj.forEach(e=>{
          
          this.programList.push({
            id: e.id, label: e.title, value: e.id          
          });
        });
       
      },
      (errorMsg: any) => {
        this.loaderService.loaderStatus.next(false);
        console.log(errorMsg);
      }
    );
  }
  onHighestQualificationSelect(_Id)
  {    
    this.loaderService.loaderStatus.next(true);
     this.professionalInfo.highest_qualification=_Id;
     let fieldName= this.highestQualificationList.filter(a=>a.id==_Id).map(b=>b.label)[0];
      this.professionalInfo.highest_qualification_name=fieldName;
     this.getProgramList(this.professionalInfo.highest_qualification);
 
  }
  onUniversitySelect(_Id)
  {
   this.loaderService.loaderStatus.next(true);
   let fieldName= this.universityList.filter(a=>a.id==_Id).map(b=>b.label)[0];
    if(fieldName.toLowerCase()=='other' || fieldName.toLowerCase()=='others')
      {   
        this.flagOtherUniversity=true;
        
      }
      else
      {
        this.flagOtherUniversity=false;
        this.professionalInfo.university_name=fieldName;
        this.complexForm.controls['other_university'].setValue('');
      }
    this.professionalInfo.university=_Id; 
    this.professionalInfo.university_name=fieldName; 
    this.getCampusList(this.professionalInfo.university);
  }


 onCampusSelect(selectedId)
  {    
     let otherId=this.campusList.filter(a=>a.label.toLowerCase()=='others'|| a.label.toLowerCase()=='other').map(b=>b.id)[0];
    let index=selectedId.findIndex(a=>a == otherId);
    if(index>-1)
    {
      this.flagOtherCampus=true;
    }
    else{
      this.flagOtherCampus=false;
       this.complexForm.controls['other_campus'].setValue('');
    }
    
    this.professionalInfo.campus=selectedId;
  }

  onProgramSelect(_Id)
  {    
     
     this.professionalInfo.programs=_Id;
     let fieldName= this.programList.filter(a=>a.id==_Id).map(b=>b.label)[0];
      this.professionalInfo.programs_name=fieldName; 
  }

  setValues()
  {
    this.complexForm.setValue({
      'tempId':this.professionalInfo.tempId = (this.professionalInfo.tempId != undefined && this.professionalInfo.tempId != null) ? this.professionalInfo.tempId : this.getRandomInt(100,200),
      'id': this.professionalInfo.id = (this.professionalInfo.id != undefined && this.professionalInfo.id != null) ? this.professionalInfo.id : -1,
     'highest_qualification': this.professionalInfo.highest_qualification = this.professionalInfo.highest_qualification != undefined && this.professionalInfo.highest_qualification != null ? this.professionalInfo.highest_qualification : null,
      'programs':this.professionalInfo.programs= this.professionalInfo.programs != undefined && this.professionalInfo.programs != null ? this.professionalInfo.programs : null,
      
      'from_date':this.professionalInfo.from_date= this.professionalInfo.from_date != undefined && this.professionalInfo.from_date != null ? moment(this.professionalInfo.from_date).toDate():  new Date(),
      'to_date':this.professionalInfo.to_date= this.professionalInfo.to_date != undefined && this.professionalInfo.to_date != null ? moment(this.professionalInfo.to_date).toDate():  new Date(),
      'university':this.professionalInfo.university= this.professionalInfo.university != undefined && this.professionalInfo.university != null ? this.professionalInfo.university : null,
      'other_university':this.professionalInfo.other_university= this.professionalInfo.other_university != undefined && this.professionalInfo.other_university != null ? this.professionalInfo.other_university : '',
      'campus':this.professionalInfo.campus=this.professionalInfo.campus != undefined && this.professionalInfo.campus != null ? this.professionalInfo.campus :[],
      'other_campus':this.professionalInfo.other_campus= this.professionalInfo.other_campus != undefined && this.professionalInfo.other_campus != null ? this.professionalInfo.other_campus : '',
      'present':this.professionalInfo.present
      
    })
    if(this.professionalInfo.highest_qualification)
    {
      this.onHighestQualificationSelect(this.professionalInfo.highest_qualification);
      this.complexForm.controls['programs'].setValue(this.professionalInfo.programs= this.professionalInfo.programs != undefined && this.professionalInfo.programs != null ? this.professionalInfo.programs : null); 
    }
    if(this.professionalInfo.university)
    {
      this.onUniversitySelect(this.professionalInfo.university);
      this.complexForm.controls['campus'].setValue(this.professionalInfo.campus=this.professionalInfo.campus != undefined && this.professionalInfo.campus != null ? this.professionalInfo.campus :[]);
    }
  }
  getValues(value)
  {
       
    if(value.highest_qualification!=null)
    {
    this.professionalInfo.tempId=value.tempId;
    this.professionalInfo.id=value.id;
    this.professionalInfo.highest_qualification=value.highest_qualification;
    this.professionalInfo.programs=value.programs;
    this.professionalInfo.from_date= moment(value.from_date).toDate();
    this.professionalInfo.to_date= moment(value.to_date).toDate();
    this.professionalInfo.university=value.university;
    this.professionalInfo.other_university=value.other_university;
    this.professionalInfo.campus=value.campus;
    this.professionalInfo.other_campus=value.other_campus;    
    this.professionalInfo.present=value.present;
    this.professionalInfo.is_completed = true; 
        if(this.flagOtherUniversity) 
        {
          this.professionalInfo.university_name=value.other_university;     
        }
    }
    else
    {
      this.professionalInfo=new EmployeeProfessionalInfo();
    }
  }

  submitEmploymentInfo(value: any) {
    this.processing=true;
    this.loaderService.loaderStatus.next(true);

    if (this.validateHighestQualification()) {
      this.complexForm.controls['highest_qualification'].setValidators(Validators.required);
      this.complexForm.controls['highest_qualification'].updateValueAndValidity();
    } else {
      this.complexForm.controls['highest_qualification'].setValidators(null);
      this.complexForm.controls['highest_qualification'].updateValueAndValidity();
    }

    if(this.complexForm.valid && !this.flagFromDate && !this.flagToDate)
    {        
          this.getValues(value);
            
          if(this.professionalInfo.highest_qualification!=undefined)
          {
          const professionalInfoMain: any = Object.assign({}, this.professionalInfo);
          professionalInfoMain.from_date = moment(this.professionalInfo.from_date).format('YYYY-MM-DD');
          let fromYear=this.professionalInfo.from_date.getFullYear();     //= this.getYear(professionalInfoMain.from_date);
            if(this.professionalInfo.present)
            {
              professionalInfoMain.to_date= moment(new Date()).format('YYYY-MM-DD');
              professionalInfoMain.duration = fromYear.toString() +'-Present';
            }
            else
            {
              professionalInfoMain.to_date = moment(this.professionalInfo.to_date).format('YYYY-MM-DD');    
              professionalInfoMain.duration = fromYear.toString() +'-'+ this.professionalInfo.to_date.getFullYear().toString() ;
            }
          // if id not present in array then post else put
          let index = this.arrayProfessionalInfo.findIndex(a=>a.id==this.professionalInfo.id  && a.tempId==this.professionalInfo.tempId);
          if(index > -1)
          {
            this.arrayProfessionalInfo[index]=professionalInfoMain;   //this.professionalInfo;
            this.professionalInfo=new EmployeeProfessionalInfo();
              this.resetForm();    
            }
          else
          {
            this.arrayProfessionalInfo.push(professionalInfoMain);
            this.professionalInfo=new EmployeeProfessionalInfo();
            this.resetForm();
          }
        }
        // need to iterate on array and if id present then put else post
          this.stageStorage.postProfessionalInfo(this.arrayProfessionalInfo).subscribe((obj)=>{
               
                this.stageStorage.setProfessionalInfoInfo(this.arrayProfessionalInfo);
                this.processing=false;
                  this.router.navigate(['../employmentinfo'], {relativeTo: this.route});
                  }    ,      
                  (errorMsg: any) => {
                    this.loaderService.loaderStatus.next(false);
                    this.processing=false;
                    console.log(errorMsg);
                    this.arrayProfessionalInfo=[];
                    this.checkForErrors(errorMsg);                 
                  });

  }
  else{
    this.loaderService.loaderStatus.next(false);
    this.validateAllFormFields(this.complexForm);
    this.processing=false;

   }
}

    validateAllFormFields(formGroup: FormGroup) {         
        Object.keys(formGroup.controls).forEach(field => {  
        const control = formGroup.get(field);   
        control.markAsTouched({ onlySelf: true });         
       
        });
    }


 addMore(_val)
  { 
    this.complexForm.controls['highest_qualification'].setValidators(Validators.required);
    this.complexForm.controls['highest_qualification'].updateValueAndValidity();


    if(this.complexForm.valid && !this.flagFromDate && !this.flagToDate)
    {
    this.getValues(_val);
            
    //check for employmentInfo !=undefine then only push
    if(this.professionalInfo.highest_qualification!=undefined)
    {
    const professionalInfoMain: any = Object.assign({}, this.professionalInfo);
    professionalInfoMain.from_date = moment(this.professionalInfo.from_date).format('YYYY-MM-DD');
     let fromYear=this.professionalInfo.from_date.getFullYear();     //= this.getYear(professionalInfoMain.from_date);
      if(this.professionalInfo.present)
      {
        professionalInfoMain.to_date=moment(new Date()).format('YYYY-MM-DD');
        professionalInfoMain.duration = fromYear.toString() +'-Present';
      }
      else
      {
        professionalInfoMain.to_date = moment(this.professionalInfo.to_date).format('YYYY-MM-DD');    
        professionalInfoMain.duration = fromYear.toString() +'-'+ this.professionalInfo.to_date.getFullYear().toString() ;
      }
      // if id not present in array then post else put
      let index = this.arrayProfessionalInfo.findIndex(a=>a.id==this.professionalInfo.id  && a.tempId==this.professionalInfo.tempId);
      if(index > -1)
      {
        this.arrayProfessionalInfo[index]=professionalInfoMain;   //this.professionalInfo;
          this.professionalInfo=new EmployeeProfessionalInfo();
            this.resetForm();     
      }
      else
      {
        this.arrayProfessionalInfo.push(professionalInfoMain);
        this.professionalInfo=new EmployeeProfessionalInfo();   
        this.resetForm();
      }
      }
  }
  else{
    console.log("validation falied");
    this.validateAllFormFields(this.complexForm);
  }
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
 resetForm()
  {
    this.professionalInfo=new EmployeeProfessionalInfo();
    this.complexForm.reset();
    this.complexForm.controls['id'].setValue(-1);
    this.complexForm.controls['tempId'].setValue(this.getRandomInt(100,200));
    this.complexForm.controls['present'].setValue(false);   
    this.complexForm.controls['from_date'].setValue(new Date()); 
    this.complexForm.controls['to_date'].setValue(new Date());
  }

 editData(_data)
  {
    this.professionalInfo=_data;
    this.setValues();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  filesUpdated(files) {
 
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;
    let fileType =file.name.substring(file.name.lastIndexOf('.')+1);
    self.resumeDetail.file_name=file.name;
    // set icon on basis of fileType 
    fileReader.addEventListener('loadend', function (loadEvent: any) {     
      self.resumeDetail.resume=loadEvent.target.result;
      self.updateDropTemplate(fileType);
    });

    fileReader.readAsDataURL(file);
  
  }
 updateDropTemplate(f_type) {
   
      this.flagResume=true;
      this.dropZonePassportTemplate = `<div class="file-droppa-document-image file-droppa-passport">
            
      <a class=${f_type} href=${this.resumeDetail.resume}><i class="fa fa-file-text-o" aria-hidden="true"></i></a>
          </div>`;
     
    }

    
    removeID()
    {   
    
      this.resumeDetail=new ResumeDetail();
      this.updateResume();        
        this.dropZonePassportTemplate =`<div class="file-droppa-document-image file-droppa-passport">
        </div>`;
        this.flagResume=!this.flagResume;  
              
    }

    updateResume()
    {
      this.loaderService.loaderStatus.next(true);
      this.stageStorage.putResume(this.resumeDetail).subscribe(
        (obj)=>{
          console.log(obj);
          this.loaderService.loaderStatus.next(false);
        },
        (err:any)=>{
          console.log(err);
          this.loaderService.loaderStatus.next(false);
        } );
    }
   
    onCheckedItemChanged(value:boolean,from){
   
      let _today=new Date();
      if(moment(from.inputFieldValue).toDate() > _today)
      {
        this.flagFromDate=true;
      }
      else
      {
        this.flagFromDate=false;
        this.professionalInfo.present=value;
      }  
      if(value)  
      {
        this.complexForm.controls['to_date'].setValue(new Date());
      }
    }
    
    checkDateValidation(from,to)
    {      
     if(moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate())
      {
        this.flagToDate=true;
      }
      else
      {
        this.flagToDate=false;
      }
      let _today=new Date();
      if(moment(from.inputFieldValue).toDate() > _today)
      {
        this.flagFromDate=true;
      }
      else
      {
        this.flagFromDate=false;       
      } 
    }

    deleteRecord(rec)
    {
      if(rec.id!=-1)
      {     
          this.stageStorage.deleteProfessional(rec).subscribe((obj)=>{
            console.log(obj);
          }  ,      
          (errorMsg: any) => {
            console.log(errorMsg);
          });
      }
        //remove this rec from array
       let index=this.arrayProfessionalInfo.findIndex(a=>a.id== rec.id && a.tempId==rec.tempId);
        this.arrayProfessionalInfo.splice(index,1);
    }

    confirm(rec) {
      this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this record?',
          accept: () => {
              //Actual logic to perform a confirmation
              this.deleteRecord(rec);
          }
      });
  }

    validateHighestQualification () : boolean {
      if (this.arrayProfessionalInfo == undefined || this.arrayProfessionalInfo.length == 0 || this.anyFieldSet()) {
        return true;
      } else {
          return false;
      }
    }

    anyFieldSet() : boolean
    {
      if (this.complexForm.value.highest_qualification|| this.complexForm.value.programs ||
      this.complexForm.value.university) {
        return true;
      } else {
        return false;
      }
    }    
  }
  

