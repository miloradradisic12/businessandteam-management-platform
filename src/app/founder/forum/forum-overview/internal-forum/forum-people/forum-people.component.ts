import { Component, OnInit } from '@angular/core';
import { ForumUserInfo, ThreadInfo } from 'app/projects/models/forum-info-model';
import { ForumService } from 'app/projects/forum.service';

@Component({
  selector: 'app-forum-people',
  templateUrl: './forum-people.component.html',
  styleUrls: ['./forum-people.component.scss']
})
export class ForumPeopleComponent implements OnInit {

  forumUserInfoList: ForumUserInfo[];
  selectedUserId: number = 0;
  userThreadInfoList: ThreadInfo[];

  constructor(private forumService: ForumService) { 
    this.forumUserInfoList = [];
    this.userThreadInfoList = [];
  }

  ngOnInit() {
    this.forumService.getForumUserInfoList().subscribe((listInfo)=>{
      this.forumUserInfoList = listInfo.user;
    })
  }

  selectedUser(id) {
    this.forumService.getForumUserThreadList(id).subscribe((listInfo)=>{
      this.userThreadInfoList = listInfo;
      this.selectedUserId = id;
    });
  }

}
