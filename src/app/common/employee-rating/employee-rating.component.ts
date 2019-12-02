import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { EmployeeRatingService } from '../../projects/employee-rating.service';
import { EmployeeRateInfo, ParameterInfo, CurrentEmployeeRating } from '../../projects/models/rating-model';


@Component({
  selector: 'app-employee-rating',
  templateUrl: './employee-rating.component.html',
  styleUrls: ['./employee-rating.component.scss'],
})
export class EmployeeRatingComponent implements OnInit {
  submitrating: boolean = true;
  empId: number = 0;
  projectTaskList: EmployeeRateInfo[];
  parameterInfoList: ParameterInfo[];
  currentEmployeeRatingInfo: CurrentEmployeeRating;

  constructor(private _location: Location, private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeRatingService: EmployeeRatingService) {
    this.empId = parseInt(this.activatedRoute.snapshot.params['empId'], 10);   
    this.projectTaskList = [];
    this.currentEmployeeRatingInfo = new CurrentEmployeeRating();
  }

  ngOnInit() {
    this.getEmpProjectsTasks();
    this.getParameterInfoList();
    this.getEmployeeCurrentRating();
  }

  getEmpProjectsTasks() {
    this.employeeRatingService.getEmpProjectsTasks(this.empId).subscribe((empInfo) => {
      this.projectTaskList = empInfo;
    });
  }

  getParameterInfoList() {
    this.employeeRatingService.getParameterInfoList().subscribe((paramInfoList) => {
      this.parameterInfoList = paramInfoList;
    });
  }

  getEmployeeCurrentRating() {
    this.employeeRatingService.getEmpCurrentRating(this.empId).subscribe((currentEmpInfo)=>{
      this.currentEmployeeRatingInfo = currentEmpInfo;
    });
  }

  isSubmitted(event) {
    event ? this.getEmpProjectsTasks() : null;
  }

}
