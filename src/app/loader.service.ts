import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class LoaderService {
  
  loaderStatus:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 

  constructor() { 
    

  }

}
