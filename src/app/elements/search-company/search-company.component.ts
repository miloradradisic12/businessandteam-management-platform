import { Component, OnInit, Input, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { ProjectRegisterService } from 'app/projects/register.service';

@Component({
  selector: 'app-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchCompanyComponent),
      multi: true
    }, ProjectRegisterService]
})
export class SearchCompanyComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  @Input() readOnly: boolean = true;
  concatCompanyName: string;
  companyName: string;
  registrationType: string;
  registrationTypeList: SelectItem[];
  errorMessage: string;
  company_data: any;

  constructor(private projectRegisterService: ProjectRegisterService) {
    this.registrationTypeList = [];
  }

  ngOnInit() {
    this.getEntityList();
  }

  ngAfterViewInit() {
  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    if (currentValue) {
      this.concatCompanyName = currentValue;
      this.companyName = currentValue.split('|')[0];
      //this.registrationType = currentValue.split('|')[1];
    }
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  getEntityList() {
    this.projectRegisterService.getEntityList().subscribe((listInfo) => {
      listInfo.forEach((element) => {
        this.registrationTypeList.push({ label: element.title, value: element.title });
      });
      this.registrationType = !this.concatCompanyName ? listInfo[0].title : this.concatCompanyName.split('|')[1];      
    });
  }

  valueChange() {
    this.errorMessage = '';
    if (this.companyName.length > 2) {
      this.projectRegisterService.getRegistrationCompany(this.companyName + ' ' + this.registrationType).subscribe((listInfo) => {        
        let internalCompanyName: string = this.companyName + ' ' + this.registrationType;
        if (listInfo.status) {
          this.concatCompanyName = this.companyName + '|' + this.registrationType;
          this.company_data = [];
          //this.onModelChange(this.concatCompanyName);
        }
        else {
          if (listInfo.error) {
            this.errorMessage = listInfo.error.message;
            this.company_data = [];
            this.concatCompanyName = undefined;
          }
          else {
            this.errorMessage = listInfo.message;
            listInfo.company_data.filter(a=>a.name.toLowerCase() == internalCompanyName.toLowerCase()).length == 0 ? this.concatCompanyName = this.companyName + '|' + this.registrationType : this.concatCompanyName = undefined;
            this.company_data = listInfo.company_data;
          }
        }
        this.onModelChange(this.concatCompanyName);
      });
    }
    else {
      this.concatCompanyName = undefined;
      this.company_data = [];
      this.onModelChange(this.concatCompanyName);
    }
  }

  getSelectedRegistrationtype() {
    this.valueChange();
  }

}
