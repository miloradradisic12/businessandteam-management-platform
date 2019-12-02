
import { Component, OnInit,OnDestroy } from '@angular/core';
import {RecruitmentService} from 'app/projects/recruitment.service';
import {CommonResponse} from 'app/core/api/CommonResponse';
import { forEach } from '@firebase/util';
import {RecruitmentFilterModel,RecruitmentRole,RecruitmentExpertise} from 'app/projects/models/RecruitmentFilterModel';
import {PublishJobModel} from 'app/projects/models/PublishJobModel';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'app-hire-employee-filter',
    templateUrl: './hire-employee-filter.component.html',
    styleUrls: ['./hire-employee-filter.component.css']
  })

export class HireEmployeeFilterComponent implements OnInit,OnDestroy {
  departments:any;
  roles:any;
  expertise:any;
  availability:any;
  hourlyBudget:any;
  experience:any;
  private filterCriteria:PublishJobModel;
  flagRoles:boolean=true;
  flagExpertise:boolean=true;
  flagGetJobDetails:boolean=false;

  filterdata: any[] =[
    {
      "title": "Category",
      "isCollapsed":true
    },
    {
      "title": "Sub Category",
      "isCollapsed":true
    },{
      "title": "Availability",
      "isCollapsed":true
    },
    {
      "title": "Experties",
      "isCollapsed":true
    },
    {
      "title": "Hourly Budget",
      "isCollapsed":true
    }
  ];
  hireEmployeeFiltersSubscription: Subscription = new Subscription();
  constructor(private recruitmentService:RecruitmentService) {
    this.filterCriteria=new PublishJobModel();
   }
   checkedAvalItem:boolean=false;
   checkedBudgetItem:boolean=false;
   checkedExperienceItem:boolean=false;
   checkedDeptItem:boolean=false;
   checkedRoleItem:boolean=false;
   checkedExpertiseItem:boolean=false;

  ngOnInit() {
    this.hireEmployeeFiltersSubscription = this.recruitmentService.hireEmployeeFilters
      .subscribe(
      (obj) => {
        if (obj != undefined) {
          this.filterCriteria = obj;     
        }
     }
    );    
  }
 
  getDepartments()
  { 
    if(this.departments)
    {
      for(let i=0;i<this.departments.length;i++)
      {
        let index=this.filterCriteria.department.findIndex(a=>a==this.departments[i].id)
        if(index>-1)
        { this.departments[i].checkedDeptItem=true;
        }
      }    
    }
    else{
    this.recruitmentService.getDepartmentFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.departments=response;       
      },
      (errorMsg: any) => {
        console.log(errorMsg);       
      }
    );
  }
  }

  onDepartmentChecked(value:boolean,deptId:number){
    this.filterCriteria.department=[];
    this.roles=new RecruitmentRole();
       
    let tempRole;
     if (this.filterCriteria.department.length == 0) {     
      this.filterCriteria.department.push(deptId); 
       tempRole= this.departments.filter((a)=>a.id==deptId)
                     .map(x=>x.role);
          this.roles=tempRole[0]; 
    }
    else {
        let index = this.filterCriteria.department.findIndex(a => a == deptId);
        if (index != -1) {
            this.filterCriteria.department.splice(index, 1);
            this.roles=new RecruitmentRole();
        }
        else {
            this.filterCriteria.department.push(deptId);
            tempRole= this.departments.filter((a)=>a.id==deptId)
            .map(x=>x.role);
            this.roles=tempRole[0];
        }
    }    
    if(this.roles.length!=0 || this.roles!=undefined)
    {
        this.flagRoles=false;
    }
    else{
      this.flagRoles=true;
    }
    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getRole()
  {
    //check for this.role    
    // if(this.filterCriteria.role.length!=undefined && this.filterCriteria.role.length!=0)
    if(this.roles)    
    {
      for(let i=0;i<this.roles.length;i++)
      {
        let index=this.filterCriteria.role.findIndex(a=>a==this.roles[i].id)
        if(index>-1)
        { this.roles[i].checkedRoleItem=true;
        }
      }    
     }
  }

  onRoleChecked(value:boolean,roleId:number){ 
    this.filterCriteria.role=[];
    this.expertise=new RecruitmentExpertise();   
  
    let tempExpertise;
    if (this.filterCriteria.role.length == 0) {
      this.filterCriteria.role.push(roleId); 
       tempExpertise= this.roles.filter((a)=>a.id==roleId)
                     .map(x=>x.expertise);
          this.expertise=tempExpertise[0]; 
    }
    else {
        let index = this.filterCriteria.role.findIndex(a => a == roleId);
        if (index != -1) {
            this.filterCriteria.role.splice(index, 1);
            this.expertise=new RecruitmentRole();
        }
        else {
            this.filterCriteria.role.push(roleId);
            tempExpertise= this.roles.filter((a)=>a.id==roleId)
            .map(x=>x.expertise);
            this.expertise=tempExpertise[0];
        }
    }  
    if(this.expertise.length!=0 || this.expertise!=undefined)
    {
        this.flagExpertise=false;
    }
    else{
      this.flagExpertise=true;
    }   
    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getExperties()
  {  
     if(this.expertise)
        {
        for(let i=0;i<this.expertise.length;i++)
        {
          //if we deselect; need to reset; and set only those which is in filterCriteria
          this.expertise[i].checkedExpertiseItem=false;
          let index=this.filterCriteria.expertise.findIndex(a=>a==this.expertise[i].id)
          if(index>-1)
          { this.expertise[i].checkedExpertiseItem=true;
          }
        }    
     }
  }

  onExpertiseChecked(value:boolean,expertiseId:number)
  {            
            if (this.filterCriteria.expertise.length == 0) {
              this.filterCriteria.expertise.push(expertiseId); 
            }
            else {
                  let index = this.filterCriteria.expertise.findIndex(a => a == expertiseId);
                  if (index != -1) {                     

                      this.filterCriteria.expertise.splice(index, 1);
                     
                  }
                  else {
                      this.filterCriteria.expertise.push(expertiseId);
                  }
              }
    //  }

      //Set updated value to service
      this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getAvailability()
  {   
    if(this.availability)
    {
      for(let i=0;i<this.availability.length;i++)
      {
        let index=this.filterCriteria.availability.findIndex(a=>a==this.availability[i].id)
        if(index>-1)
        { this.availability[i].checkedAvalItem=true;
        }
      }    
    }
    else{
    this.recruitmentService.getAvailabilityFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.availability=response;        
      },
      (errorMsg: any) => {
        console.log(errorMsg);       
      }
    );
  }
  }

  onAvailabilityChecked(value:boolean,availabilityId:number){   
    
    this.filterCriteria.availability=[];
           if (this.filterCriteria.availability.length == 0) {
          this.filterCriteria.availability.push(availabilityId); 
        }
        else {
            let index = this.filterCriteria.availability.findIndex(a => a == availabilityId);
            if (index != -1) {
                this.filterCriteria.availability.splice(index, 1);
          
            }
            else {
                this.filterCriteria.availability.push(availabilityId);
            }
      }
      //Set updated value to service
      this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getexperience()
  {  
    if(this.experience)
    {
      for(let i=0;i<this.experience.length;i++)
      {
        let index=this.filterCriteria.experience.findIndex(a=>a==this.experience[i].id)
        if(index>-1)
        { this.experience[i].checkedExperienceItem=true;
        }
      }    
    }
    else{
    this.recruitmentService.getExperienceFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.experience=response;        
      },
      (errorMsg: any) => {
        console.log(errorMsg);       
      }
    );
  }
  }
  onExperienceChecked(value:boolean,experienceId:number){  
    this.filterCriteria.experience=[];
    if (this.filterCriteria.experience.length == 0) {
      this.filterCriteria.experience.push(experienceId); 
    }
    else {
        let index = this.filterCriteria.experience.findIndex(a => a == experienceId);
        if (index != -1) {
            this.filterCriteria.experience.splice(index, 1);
      
        }
        else {
            this.filterCriteria.experience.push(experienceId);
        }
  }
  //Set updated value to service
  this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getHourlyBudget()
  {  
    if(this.hourlyBudget)
    {
      for(let i=0;i<this.hourlyBudget.length;i++)
      {
        let index=this.filterCriteria.hourlybudget.findIndex(a=>a==this.hourlyBudget[i].id)
        if(index>-1)
        { this.hourlyBudget[i].checkedBudgetItem=true;
        }
      }    
    }
    else{
    this.recruitmentService.getHourlyBudgetFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.hourlyBudget=response;    
      },
      (errorMsg: any) => {
        console.log(errorMsg);       
      }
    );
  }
  }
  onHourlyBudgetChecked(value:boolean,hourlyBudgetId:number){   
    this.filterCriteria.hourlybudget=[];
    if (this.filterCriteria.hourlybudget.length == 0) {
      this.filterCriteria.hourlybudget.push(hourlyBudgetId); 
    }
    else {
        let index = this.filterCriteria.hourlybudget.findIndex(a => a == hourlyBudgetId);
        if (index != -1) {
            this.filterCriteria.hourlybudget.splice(index, 1);
      
        }
        else {
            this.filterCriteria.hourlybudget.push(hourlyBudgetId);
        }
  }
    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }
  ngOnDestroy()
  {
    this.hireEmployeeFiltersSubscription.unsubscribe();
  }
}
