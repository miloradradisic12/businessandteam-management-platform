import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Index as EmployeeInfo } from '../../../../employeeprofile/models/index';
import { commonFilters, FindWorkFilters } from '../../../../employeeprofile/models/find-work-filters';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @ViewChild('acc1') accordion: NgbAccordion;
  flagRoles: boolean = true;
  flagExpertise: boolean = true;
  flagGetJobDetails: boolean = false;
  flagReset: boolean = false;
  @Output() selectedemployeeFilters = new EventEmitter<FindWorkFilters>();
  @Input() findWorkFilters: FindWorkFilters = new FindWorkFilters();
  //findWorkFilters: FindWorkFilters = new FindWorkFilters();

  //findWorkFilters: FindWorkFilters = new FindWorkFilters();
  categoryList: commonFilters[] = [];// new commonFilters();
  subcategoryList: commonFilters[] = [];//new commonFilters();
  availabilityList: commonFilters[] = [];//new commonFilters();
  expertiseList: commonFilters[] = [];//new commonFilters();
  experienceList: commonFilters[] = [];//new commonFilters();
  hourlyBugetList: commonFilters[] = [];//new commonFilters();

  constructor(private route: ActivatedRoute, private filterForEmpService: StageStorage) { }

  ngOnInit() {
    /*this.filterForEmpService.getSelfInfo().subscribe((obj)=>{
      this.getAllCategory();
      this.getAllSubCategory();
      this.getAllExpertise();
      this.getAllExperience();
      this.getAllHourlyBudget();
      this.getAllAvailability();
    });*/
    this.filterForEmpService.getBasicInfo().subscribe((basicInfo) => {
      this.filterForEmpService.getSelfInfo(basicInfo.userprofile_id).subscribe((obj) => {
        this.findWorkFilters.availability = obj.availability_details[0].hours_per_day.id;
        this.findWorkFilters.experience = obj.basic_details[0].total_experience;
        let employment_detailsList = obj.employment_details;//.employment_details.map(a=>a.functional_areas);
        if (employment_detailsList && employment_detailsList.length > 0) {
          let departmentIds: number[] = [];//
          let functional_areasIds: number[] = [];
          let roleIds: number[] = [];
          for (let i = 0; i < employment_detailsList.length; i++) {
            if (employment_detailsList[i].departments != undefined && employment_detailsList[i].departments.length > 0) {
              for (let d = 0; d < employment_detailsList[i].departments.length; d++) {
                departmentIds.push(employment_detailsList[i].departments[d].id);
              }
              //departmentIds.push(employment_detailsList[i].departments.map(a=>a.id));
              // employment_detailsList[i].departments.map(a=>a.id).subscribe((ids)=>{
              //   departmentIds.push(ids);
              // });
            }
            if (employment_detailsList[i].functional_areas != undefined && employment_detailsList[i].functional_areas.length > 0) {
              for (let f = 0; f < employment_detailsList[i].functional_areas.length; f++) {
                functional_areasIds.push(employment_detailsList[i].functional_areas[f].id);
              }
              //functional_areasIds.push(employment_detailsList[i].functional_areas.map(a=>a.id));
              // employment_detailsList[i].functional_areas.map(a=>a.id).subscribe((ids)=> {
              //   functional_areasIds.push(ids);
              // });
            }
            if (employment_detailsList[i].role != undefined && employment_detailsList[i].role.length > 0) {
              //roleIds.push(employment_detailsList[i].role.map(a=>a.id));
              // employment_detailsList[i].role.map(a=>a.id).subscribe((ids)=>{
              //   roleIds.push(ids);
              // });
              for (let e = 0; e < employment_detailsList[i].role.length; e++) {
                roleIds.push(employment_detailsList[i].role[e].id);
              }
            }
          }

          this.findWorkFilters.categories = departmentIds.filter((x, i, a) => x && a.indexOf(x) === i);
          this.findWorkFilters.expertise = functional_areasIds.filter((x, i, a) => x && a.indexOf(x) === i);
          this.findWorkFilters.sub_categories = roleIds.filter((x, i, a) => x && a.indexOf(x) === i);
        }

        this.findWorkFilters.hourlybudget = obj.availability_details[0].hourly_charges.id;

        this.getAllCategory();
        this.getAllSubCategory();
        this.getAllExpertise();
        this.getAllExperience();
        this.getAllHourlyBudget();
        this.getAllAvailability();

        this.selectedemployeeFilters.emit(this.findWorkFilters);
      });
    });

    // this.findWorkFilters.experience = 2;
    // this.findWorkFilters.categories = [2, 3];
    // this.findWorkFilters.expertise = [3, 2];
    // this.findWorkFilters.sub_categories = [3, 2];
    // this.findWorkFilters.hourlybudget = 2;
    // this.getAllCategory();
    // this.getAllSubCategory();
    // this.getAllExpertise();
    // this.getAllExperience();
    // this.getAllHourlyBudget();
    // this.getAllAvailability();    
  }

  getAllCategory() {
    this.filterForEmpService.getAllCategory().subscribe((categoryList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < categoryList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.categories != undefined ? this.findWorkFilters.categories.findIndex(a => a == categoryList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = categoryList[i].id;
        data.is_active = categoryList[i].is_active;
        data.title = categoryList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.categoryList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });

  }

  getAllSubCategory() {
    this.filterForEmpService.getAllSubCategory().subscribe((subCategoryList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < subCategoryList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.sub_categories != undefined ? this.findWorkFilters.sub_categories.findIndex(a => a == subCategoryList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = subCategoryList[i].id;
        data.is_active = subCategoryList[i].is_active;
        data.title = subCategoryList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.subcategoryList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllExpertise() {
    this.filterForEmpService.getAllExpertise().subscribe((expertiseList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < expertiseList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.expertise != undefined ? this.findWorkFilters.expertise.findIndex(a => a == expertiseList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = expertiseList[i].id;
        data.is_active = expertiseList[i].is_active;
        data.title = expertiseList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.expertiseList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllExperience() {
    this.filterForEmpService.getAllExperience().subscribe((experienceList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < experienceList.length; i++) {
        let data: commonFilters = new commonFilters();
        data.id = experienceList[i].id;
        data.is_active = experienceList[i].is_active;
        data.title = experienceList[i].title;
        if (this.findWorkFilters != undefined && this.findWorkFilters.experience != undefined && this.findWorkFilters.experience == experienceList[i].id) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.experienceList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllHourlyBudget() {
    this.filterForEmpService.getAllHourlyBudget().subscribe((hourlyBudgetList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < hourlyBudgetList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.hourlybudget != undefined ? this.findWorkFilters.hourlybudget == hourlyBudgetList[i].id ? i : -1 : -1;
        let data: commonFilters = new commonFilters();
        data.id = hourlyBudgetList[i].id;
        data.is_active = hourlyBudgetList[i].is_active;
        data.title = hourlyBudgetList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.hourlyBugetList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllAvailability() {
    this.filterForEmpService.getAllAvailability().subscribe((availabilityList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < availabilityList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.availability != undefined ? this.findWorkFilters.availability == availabilityList[i].id ? i : -1 : -1;
        let data: commonFilters = new commonFilters();
        data.id = availabilityList[i].id;
        data.is_active = availabilityList[i].is_active;
        data.title = availabilityList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.availabilityList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  onExpertiseChecked(value: boolean, expertiseId: any) {
    let index = this.expertiseList != undefined && this.expertiseList.length > 0 ? this.expertiseList.findIndex(a => a.id == expertiseId) : -1;
    this.expertiseList[index].is_checked = value;
    //this.findWorkFilters.expertise
    //expertiseId = isNaN(expertiseId) ? parseInt(expertiseId) : expertiseId;

    if (value) {
      this.findWorkFilters.expertise.push(parseInt(expertiseId));
    }
    else {
      this.findWorkFilters.expertise.splice(this.findWorkFilters.expertise.indexOf(parseInt(expertiseId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onCategoryChecked(value: boolean, categoryId: any) {
    let index = this.categoryList != undefined && this.categoryList.length > 0 ? this.categoryList.findIndex(a => a.id == categoryId) : -1;
    this.categoryList[index].is_checked = value;
    //categoryId = isNaN(categoryId) ? parseInt(categoryId) : categoryId;
    if (value) {
      this.findWorkFilters.categories.push(parseInt(categoryId));
    }
    else {
      this.findWorkFilters.categories.splice(this.findWorkFilters.categories.indexOf(parseInt(categoryId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onSubCategoryChecked(value: boolean, subCategoryId: any) {
    let index = this.subcategoryList != undefined && this.subcategoryList.length > 0 ? this.subcategoryList.findIndex(a => a.id == subCategoryId) : -1;
    this.subcategoryList[index].is_checked = value;
    //subCategoryId = isNaN(subCategoryId) ? parseInt(subCategoryId) : subCategoryId;
    if (value) {
      this.findWorkFilters.sub_categories.push(parseInt(subCategoryId));
    }
    else {
      this.findWorkFilters.sub_categories.splice(this.findWorkFilters.sub_categories.indexOf(parseInt(subCategoryId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onAvailabilityChecked(value: boolean, availabilityId: any) {
    let index = this.availabilityList != undefined && this.availabilityList.length > 0 ? this.availabilityList.findIndex(a => a.id == availabilityId) : -1;    
    this.availabilityList.forEach(value=>{
      value.is_checked = false;
    });
    this.availabilityList[index].is_checked = value;
    //availabilityId = isNaN(availabilityId) ? parseInt(availabilityId) : availabilityId;
    this.findWorkFilters.availability = value ? parseInt(availabilityId) : 0;
    this.selectedFilters(this.findWorkFilters);
  }

  onExperienceChecked(value: boolean, experienceId: any) {
    let index = this.experienceList != undefined && this.experienceList.length > 0 ? this.experienceList.findIndex(a => a.id == experienceId) : -1;
    this.experienceList.forEach(value=>{
      value.is_checked = false;
    });
    this.experienceList[index].is_checked = value;
    this.findWorkFilters.experience = value ? parseInt(experienceId) : 0;
    this.selectedFilters(this.findWorkFilters);
  }

  onHourlyBudgetChecked(value: boolean, hourlyBudgetId: any) {
    let index = this.hourlyBugetList != undefined && this.hourlyBugetList.length > 0 ? this.hourlyBugetList.findIndex(a => a.id == hourlyBudgetId) : -1;
    this.hourlyBugetList.forEach(value=>{
      value.is_checked = false;
    });
    this.hourlyBugetList[index].is_checked = value;
    this.findWorkFilters.hourlybudget = value ? parseInt(hourlyBudgetId) : 0;
    this.selectedFilters(this.findWorkFilters);
  }

  selectedFilters(filter: FindWorkFilters) {
    this.selectedemployeeFilters.emit(this.findWorkFilters);
  }
  // ngOnChanges(changes: any){
  // }

}
