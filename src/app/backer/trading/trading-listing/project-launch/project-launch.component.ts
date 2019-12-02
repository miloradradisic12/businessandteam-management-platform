import { Component, OnInit, Input } from '@angular/core';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { TradingService } from 'app/projects/trading.service';
import { TradingInfo } from 'app/projects/models/trading-model';



@Component({
  selector: 'app-project-launch',
  templateUrl: './project-launch.component.html',
  styleUrls: ['./project-launch.component.scss'],
  providers: [PaginationMethods]
})
export class ProjectLaunchComponent implements OnInit {
  searchText: '';
  count: number;
  pageSize = 5;
  @Input() tradingType: string;
  tradinInfoList: TradingInfo[] = [];

  constructor(private paginationMethods: PaginationMethods,
    private tradingService: TradingService
  ) { }

  ngOnInit() {
  }
  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getTradingList(1);
    }
  }
  getTradingList(newPage) {
    if (newPage) {
      this.tradingService.list(newPage, this.pageSize, this.searchText, this.tradingType)
        .subscribe((infoList: any) => {          
          this.tradinInfoList = infoList['results'] as TradingInfo[];
          this.count = infoList['count'];
        });
    }
  }

}
