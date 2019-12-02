import { Component,OnInit, AfterViewChecked,ChangeDetectorRef  } from '@angular/core';
import { LoaderService } from './loader.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  // tslint:disable-next-line
 selector: 'body',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit , AfterViewChecked {
  loading = true;
  loaderSubscription = new Subscription();

  constructor(private loaderService:LoaderService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loaderSubscription = this.loaderService.loaderStatus.subscribe((status: boolean) => {
      //console.log(`Show loader bar - ${status}`);
      this.loading = status;
    });
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

}
