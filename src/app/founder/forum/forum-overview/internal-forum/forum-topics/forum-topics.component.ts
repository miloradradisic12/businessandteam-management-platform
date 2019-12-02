import { Component, OnInit } from '@angular/core';
import { ForumService } from 'app/projects/forum.service';
import { ForumInfoModel, CommentThreadInfo, ThreadInfo } from 'app/projects/models/forum-info-model';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forum-topics',
  templateUrl: './forum-topics.component.html',
  styleUrls: ['./forum-topics.component.scss'],
  providers: [PaginationMethods]
})
export class ForumTopicsComponent implements OnInit {

  forumInfoModel: ForumInfoModel;
  commentsAgainstThread: ThreadInfo;
  commentThreadInfoList: CommentThreadInfo[];
  topic: string;
  count: number;
  pageSize = 5;
  replyAgainstForumId: number = 0;
  replyAgainstPostId: number = 0;
  description: string;
  threadId: number;


  constructor(private forumService: ForumService,
    private router: Router, private route: ActivatedRoute) {
    this.forumInfoModel = new ForumInfoModel();
    this.commentThreadInfoList = [];
    this.commentsAgainstThread = new ThreadInfo();
    this.threadId = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : undefined;
  }

  ngOnInit() {
    if (!this.threadId) {
      this.forumService.getTopicInfoList().subscribe((listInfo) => {
        this.forumInfoModel.topicInfoList = listInfo;
        console.log(this.forumInfoModel.topicInfoList);
        
      });
    }
    else {
      //this.getThreadInfoList(1);
    }
    
  }

  selectedTopic(id: number) {
    this.forumInfoModel.selectedTopicId = id;
    //this.getThreadInfoList(1);
  }

  getThreadInfoList(newPage) {
    if (newPage) {
      if (!this.threadId) {
        this.forumService.getTopicsTreadInfoList(this.forumInfoModel.selectedTopicId, newPage, this.pageSize,
          this.forumInfoModel.searchText).subscribe((listInfo) => {
            this.forumInfoModel.threadInfoList = listInfo.thread['results'];
            this.count = listInfo.thread['count'];
            this.topic = listInfo.title;
          });
      }
      else {
       
        this.forumService.getTreadInfoByIdList(this.threadId, newPage, this.pageSize,
          this.forumInfoModel.searchText).subscribe((listInfo) => {  
            this.commentsAgainstThread.id = listInfo.id;
            this.commentsAgainstThread.title = listInfo.title;
            this.commentsAgainstThread.created_date = listInfo.created_date;
            this.commentsAgainstThread.description = listInfo.description;
            this.commentsAgainstThread.owner = listInfo.owner;
            this.commentsAgainstThread.image = listInfo.image;
            this.commentThreadInfoList = listInfo.thread_comments['results'];
            this.count = listInfo.thread_comments['count'];
            this.topic = listInfo.title;
          });
      }
    }
  }

  //getThreadInfoListById(new)

  replyAgainstThread(id: number) {
    this.replyAgainstForumId = id;
    this.description = '';
  }

  saveReply() {
    this.forumService.savePostsAgainstThread({
      thread: this.replyAgainstForumId,
      parent_comment: this.replyAgainstPostId != 0 ? this.replyAgainstPostId : null,
      text: this.description
      , subcomments: []
    }).subscribe((obj) => {
      this.getThreadInfoList(1);
      this.replyAgainstForumId = 0
      this.replyAgainstPostId = 0
    });
  }

  replyAgainstPost(threadId: number, postId: number) {
    this.replyAgainstPostId = postId;
    this.replyAgainstForumId = threadId;
    this.description = '';
  }

  selectedThreadId(id) {
    this.forumService.setThreadViewCount(id).subscribe((obj) => {
      this.router.navigate([`../topics/${id}`], {relativeTo: this.route})
    });
  }

}
