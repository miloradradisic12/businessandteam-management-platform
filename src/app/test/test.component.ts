
import {Component, OnInit} from '@angular/core';
import {Message,DropdownModule,SelectItem} from 'primeng/primeng';


interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})


export class TestComponent implements OnInit {
  msgs: Message[] = [];
  cities1: SelectItem[];
  // cities:{id:number,title:string}[];
  // cities3:City[];

  cities: City[];

  returninform:{label:string, value:string}[];

  constructor() {
    this.cities1 = [
      {label:'Select City', value:null},
      {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
      {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
      {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
      {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
      {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
  ];
  this.cities = [
    {name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'},
    {name: 'Istanbul', code: 'IST'},
    {name: 'Paris', code: 'PRS'}
];
  // this.cities = [
  //   {id:1,title:'A'},
  //   {id:2,title:'B'},
  //   {id:3,title:'C'},
  //   {id:4,title:'D'},
  //   {id:5,title:'E'}
  // ]

  // this.cities3 = [
  //   {code:1,name:'A'},
  //   {code:2,name:'B'},
  //   {code:3,name:'C'},
  //   {code:4,name:'D'},
  //   {code:5,name:'E'}
  // ]

  this.returninform = [
    {label:'Stock',value:'stock'},
    {label:'Pref_Stocks',value:'pref_Stocks'}
  ];
  }

  ngOnInit(): void {
  }

  showSuccsess() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Info Message', detail: 'PrimeNg rocks'});

    this.msgs.push({severity: 'info', summary: 'Info Message', detail: 'PrimeNg rocks'});

  }
}
