import { Component, Input, OnInit  } from '@angular/core';
import MilestoneModel from 'app/projects/models/MilestoneModel';

/**
 * Form for adding/editing milestone object.
 *
 * @input milestone: MilestoneModel instance
 */
@Component({
  selector: 'app-project-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: [
    './milestone-form.component.scss'
  ]
})



export class MilestoneFormComponent implements OnInit  {
  @Input() milestone: MilestoneModel;
  @Input() categoryImageList;
  @Input() projectMilestones;
  @Input() shownextform;
  place_it_after:number=0;

  milestonesimgs: any;
  selectedindex:any;
  iconList: any[];
  selectedMilestone:any[];
  milestoneList:any[];
  constructor() {
    this.iconList = [];
    this.milestoneList = [];

    // this.selectedMilestone= this.milestone.icon_name && this.milestone.icon_name != '' ? this.categoryImageList.filter(a=>a.value == this.milestone.icon_name)  : this.categoryImageList[0];
    
   
  }
  
 
  ngOnInit()
  {
    this.categoryImageList.forEach(element => {
      this.iconList.push({label: element.value, value: element.value});
    });
    this.projectMilestones.forEach(element => {
      this.milestoneList.push({label: element.title, value: element.id});
    });
    if(!this.milestone.place_it_after) {
      this.milestone.place_it_after = this.milestoneList[0].value;
    }

    //To handle nulls in predifined milestones
    if(!this.milestone.icon_category){
      this.milestone.icon_category = 'default';
      this.milestone.icon_name = 'default.png';
    }

    this.selectedMilestone=this.categoryImageList.find(x => x.value === this.milestone.icon_category);

    this.place_it_after=this.milestone.place_it_after;
  }

  onStartDateChange(startDate: Date) {
    if (this.milestone.date_end < startDate) {
      this.milestone.date_end = startDate;
    }
  }

  onEndDateChange(endDate: Date) {
    if (this.milestone.date_start > endDate) {
      this.milestone.date_start = endDate;
    }
  }

  onSelectedIconType(value) {
    this.selectedMilestone = this.categoryImageList.filter(a=>a.value == value)[0];
  
  }
  // selectedImage(event,milestoneimg,index){
  //   this.selectedindex=index;
  //   this.milestone.icon_name=milestoneimg;

  // }
  onSlectedAfterMilestone(value)
  {
    debugger;    
    if(this.milestone.place_it_after != this.place_it_after){
      this.milestone.isPlaceAfterChanged=true;
      this.milestone.place_it_after=this.place_it_after;
    }

  }
  // shownextformfun(){
  //   this.shownextform=!this.shownextform;
  //   this.nextformshow.emit(this.shownextform);

  // }
}
