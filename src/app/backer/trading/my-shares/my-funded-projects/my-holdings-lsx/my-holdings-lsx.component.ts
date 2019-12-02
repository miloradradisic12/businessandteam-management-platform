import { Component, OnInit } from '@angular/core';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
@Component({
  selector: 'app-my-holdings-lsx',
  templateUrl: './my-holdings-lsx.component.html',
  styleUrls: ['./my-holdings-lsx.component.scss'],
  providers: [PaginationMethods]
})
export class MyHoldingsLsxComponent implements OnInit {
  searchText: '';
  pageSize = 5;

  constructor(private paginationMethods: PaginationMethods
  ){
  }

  ngOnInit() {
  }
  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getNewEmpoloyeeList(1);
      }
     
  }
  getNewEmpoloyeeList(newPage) {
    //../employee-job-list/?professional_details__departments=1&professional_details__expertise=4&professional_details__role=2&professional_details__total_experience=2&professional_details__hourly_charges=2&availability_details__days_per_year=1&availability_details__hours_per_day=7
     if (newPage) {
       // this.recruitmentService.list(newPage, this.pageSize,this.stage,this.searchText)
      //  this.recruitmentService.directHireJobPostingList(newPage,this.pageSize,this.searchText, this.projectId)
      //  .subscribe((empJob:HireEmployeeModel[]) => {
      //      this.employees = empJob['results'];
      //      this.count = empJob['count'];
      //     // this.paginationReset = false;
      //    });
     }
   }
}
