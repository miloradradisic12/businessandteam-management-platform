import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import WallmartProductModel from 'app/projects/models/WallmartProductModel';
import ProjectBudgetModel from 'app/projects/models/ProjectBudgetModel';
import ProjectProductModel from 'app/projects/models/ProjectProductModel';
import { ConfirmationService } from 'primeng/primeng';
import { CustomValidators } from 'app/core/custom-form-validator';

@Component({
  selector: 'app-material-cost',
  templateUrl: './material-cost.component.html',
  styleUrls: ['./material-cost.component.scss'],
  providers: [PaginationMethods]
})
export class MaterialCostComponent implements OnInit {
  projectId: number;
  projectBudget: ProjectBudgetModel;
  products: ProjectProductModel[];
  count: number;
  pageSize = 5;
  searchText: '';
  productUrl: string = '';
  currentPage: number;
  confirmationMessage: string = '';
  addingManually: boolean = false;
  product: ProjectProductModel;

  frmAddProductManually: FormGroup;
  productName: FormControl;
  productDescription: FormControl;
  quantity: FormControl;
  price: FormControl;

  errorMessages:any = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private paginationMethods: PaginationMethods) {
    this.projectBudget = new ProjectBudgetModel();
    this.product = new ProjectProductModel();

    this.productName = new FormControl('', Validators.required);
    this.productDescription = new FormControl('', Validators.required);
    this.quantity = new FormControl('', [Validators.required, CustomValidators.numeric]);
    this.price = new FormControl('', [Validators.required, CustomValidators.numeric]);

    this.frmAddProductManually = fb.group({
      productName: this.productName,
      productDescription: this.productDescription,
      quantity: this.quantity,
      price: this.price,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  }

  addProduct(product: WallmartProductModel) {
    console.log(`product`);
    console.log(product);
    this.projectsService.saveProductSelection(this.projectId, product, false).subscribe(() => {
      console.log('saved');
      this.getMatrialCost(1);
    });
  }

  addByProductUrl() {
    debugger;
    let product = new WallmartProductModel();
    product.product_id = this.productUrl;
    product.quantity = 1;
    this.projectsService.saveProductSelection(this.projectId, product, true).subscribe((data) => {
      if(data.errors){
        data.errors.forEach((item)=>{
          if(item.code == 4002){
            this.errorMessages.push('Invalid item, item not found for the product url!');
          }
          else{
            this.errorMessages.push(item.message);
          }
        });
        setTimeout(() => {
          this.errorMessages = [];
        }, 4000);
      }

      this.productUrl = '';
      this.getMatrialCost(1);
    });
  }

  getMatrialCost(newPage) {
    if (newPage) {
      this.projectsService.productList(this.projectId, newPage, this.pageSize, this.searchText)
        .subscribe((data) => {
          this.projectBudget = data;
          if (data.project_product_budget) {
            this.products = data.project_product_budget.results;
            this.count = data.project_product_budget.count;
            this.currentPage = newPage;
          }
          else {
            this.products = null;
          }
        });
    }
  }

  confirm(rec) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.deleteProduct(rec);
      }
    });
  }

  deleteProduct(product: ProjectProductModel) {
    this.projectsService.deleteProduct(this.projectId, product.id).subscribe(() => {
      this.getMatrialCost(this.currentPage);
    });
  }

  cancelManually() {
    this.frmAddProductManually.reset();
    this.addingManually = false;
  }

  addProductManually() {
    if (this.frmAddProductManually.valid) {
      this.product.project = this.projectId;
      this.projectsService.addProductManually(this.product).subscribe((data)=>{
        this.getMatrialCost(1);
        this.cancelManually();
      });
    }
    else {
      this.validateAllFormFields(this.frmAddProductManually);
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