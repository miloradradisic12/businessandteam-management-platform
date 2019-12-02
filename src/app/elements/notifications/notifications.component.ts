import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from 'app/founder/account/account.service';
import { NotificationModel } from '../../projects/models/notification-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationModel[];
  constructor(private _location: Location, 
    private accountService: AccountService, 
    private router: Router) {
    this.notifications = [];
  }

  ngOnInit() {
    this.accountService.getNotificationList().subscribe((listInfo) => {      
      this.notifications = listInfo;
    });
  }

  goTo(notification: NotificationModel) {    

    if(!notification.read) {
      this.accountService.cachedNotificationCount = (this.accountService.cachedNotificationCount - 1);
      notification.read = true;
    }
    this.accountService.markAsReadNotification(notification).subscribe((listInfo)=>{
      this.router.navigate([`/founder/projects/${notification.project}/task`]);
    });
    
  }

}
