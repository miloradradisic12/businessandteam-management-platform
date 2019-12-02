import { Component, OnInit, Output, EventEmitter, forwardRef, Input, ViewChild } from '@angular/core';
import { ProjectsService } from "app/projects/projects.service";
import WallmartProductModel from "app/projects/models/WallmartProductModel";
import { NgbRatingConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchProductComponent),
    multi: true
  }, NgbRatingConfig]
})
export class SearchProductComponent implements OnInit {
  // @Output() onSelectedProduct = new EventEmitter<WallmartProductModel>();
  @Input() readOnly: boolean = false;
  @Input() content: boolean = false;
  @Output() forceSave = new EventEmitter();
  @ViewChild('popUpForShowInterestMessage') popUpForShowInterestMessage;

  selectedProducts = [];
  searchText: string = '';
  _timeout: any;
  productUrl: string = '';
  addingManually: boolean = false;
  manualProductAdded: boolean = false;
  manualProductName: any = '';
  manualProductImg: any = '';
  showcompare: boolean = false;
  productsubmit: boolean = false;
  isOnlyBack: boolean = false;

  wallmartResponse: { numItems: number, totalResults: number, start: number, products: WallmartProductModel[] };
  searchResult: WallmartProductModel[];
  showdesc: number = 0;
  popUpForShowInterestModalRef: NgbModalRef;

  errorMessages:any = [];

  constructor(
    private projectService: ProjectsService,
    config: NgbRatingConfig,
    private modalService: NgbModal
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
  }

  modelchange() {
    if (this.selectedProducts.length >= 3) {
      this.searchResult = null;
      this.wallmartResponse = null;
      this.searchText = '';
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
      return false;
    }
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    if (this.searchText !== '') {
      this._timeout = setTimeout(() => {
        this._timeout = null;
        this.projectService.productSearch(this.searchText).subscribe((data) => {
          this.wallmartResponse = data;
          this.searchResult = this.wallmartResponse.products;
        });
      }, 500);
    }
    else {
      this.wallmartResponse = null;
      this.searchResult = null;
      this._timeout = null;
    }
  }

  ReturnSelectedProduct(product: WallmartProductModel) {
    if (product) {

      this.projectService.getSingleProductById(product.product_id, false).subscribe((singleProduct) => {
        this.selectedProducts.push(singleProduct.product_features[0]);
        this.searchResult = null;
        this.wallmartResponse = null;
        this.searchText = '';
      }, (error) => {
        console.log(error);
      });
    }
  }


  addByProductUrl() {
    let product = new WallmartProductModel();
    if (this.selectedProducts.length >= 3) {
      this.searchResult = null;
      this.wallmartResponse = null;
      this.searchText = '';
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
      return false;
    }
    product.product_id = this.productUrl;
    this.projectService.getSingleProductById(this.productUrl, true).subscribe((data) => {
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
      else{
        this.productUrl = '';
        this.selectedProducts.push(data.product_features[0]);
      }
    }, (error) => {
      console.log(error);
    });

  }


  removeproduct(prod_index) {
    if (this.selectedProducts[prod_index].isCustomProduct == true) {
      this.manualProductAdded = false;
    }

    this.selectedProducts.splice(prod_index, 1);
  }
  imageChangeListener($event, document: string) {
    this.manualProductImg = $event.src;
  }

  saveCustomProduct() {
    if (this.manualProductName != '' && this.manualProductImg != '') {
      this.selectedProducts.push({
        isCustomProduct: true,
        isProductAdded: false,
        thumbnailImage: this.manualProductImg,
        name: this.manualProductName,
        brandName: '',
        msrp: 0,
        price: 0,
        categoryPath: '',
        categoryNode: '',
        shortDescription: '',
        color: '',
        customerRating: 0,
        numReviews: 0,
        bundle: false,
        attributes: false,
        gender: '',
        age: 0
      });
      this.addingManually = false;
      this.manualProductAdded = true;
    }
    else {
      return false;
    }
  }

  compareproducts() {
    this.showcompare = true;

  }
  updateproduct() {
    var matchindex = this.selectedProducts.findIndex(x => x.isCustomProduct == true);
    this.productsubmit = true;
    matchindex > -1 ? this.selectedProducts[matchindex].isProductAdded = true : false;
    let data = {
      productcompare_answer: this.selectedProducts
    }
    this.onModelChange(data);
    this.onChange(data);
    this.isOnlyBack = true;
  }

  editIfCustome() {
    var matchindex = this.selectedProducts.findIndex(x => x.isCustomProduct == true);
    matchindex > -1 ? this.selectedProducts[matchindex].isProductAdded = false : true;
    this.isOnlyBack = false;
    /*let data = {
      productcompare_answer: this.selectedProducts
    }*/
  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    currentValue ? this.selectedItems(currentValue) : [];    
  }

  selectedItems(currentValue) {
    currentValue.productcompare_answer.forEach(element => {
      this.selectedProducts.push(element);
    });
    this.showcompare = true;
    this.isOnlyBack = true;
    this.selectedProducts.length >= 3 ? this.manualProductAdded = true : this.manualProductAdded = false;
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}

