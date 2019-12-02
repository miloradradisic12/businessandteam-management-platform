import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-trading-listing',
  templateUrl: './trading-listing.component.html',
  styleUrls: ['./trading-listing.component.scss']
})
export class TradingListingComponent implements OnInit {

  tradingType: string;

  constructor(private route: ActivatedRoute,
    private router: Router, private _location: Location) { 
      this.tradingType = this.route.snapshot.params['pagename'];
    }

  ngOnInit() {
  }

}
