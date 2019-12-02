import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { ChatService } from 'app/collaboration/chat.service';
import { ChatMessageModel } from 'app/collaboration/models';
import UserProfileModel from 'app/core/models/UserProfileModel';

@Component({
  selector: 'app-project-room',
  templateUrl: './project-room.component.html',
  styleUrls: ['./project-room.component.scss']
})
export class ProjectRoomComponent implements OnInit, OnDestroy {

  @Input() roomId;
  @Input() groupName;

  @ViewChild(PerfectScrollbarComponent) scrollbar: PerfectScrollbarComponent;
  @ViewChild('chatbottomoptions') chatbottomoptions: ElementRef;
  @ViewChild('chatmessagesHgt') chatmessagesHgt: ElementRef;

  chatMessageInfoList: ChatMessageModel[];
  timerId: any;
  messageText: string;
  viewHeight: number = 150;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.getChartHistory();
  }

  getChartHistory() {
    this.chatService.getProjectChartHistory(this.roomId).subscribe(obj => {
      this.loadMessages(obj);
       this.timerId = setInterval(() => {
         this.updateMessages();
       }, 5000);
     // this.updateMessages();


    });
    this.chatbottomoptionsHgt();
  }

  updateMessages() {
    return this.chatService.getProjectChartHistory(this.roomId)
      .subscribe((messages) => this.loadMessages(messages));
  }

  loadMessages(messages: ChatMessageModel[]) {
    this.chatMessageInfoList = _.orderBy(messages, 'time');
    let tempUser = this.chatMessageInfoList.filter((x, i, a) => x && a.findIndex(j => j.userId == x.userId) === i);

    for (const message of tempUser) {
      this.chatService.getChatUser(message.userId).subscribe((user) => {
        for (const message1 of this.chatMessageInfoList.filter(a => a.userId == message.userId)) {
          message1.user = user;
        }
      });
    }
  }

  getUsername(user: UserProfileModel) {
    if (!user) {
      return '';
    }
    if (user.first_name || user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.email) {
      return user.email;
    }
    if (user.phone_number) {
      return user.phone_number;
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  onTextInputKeyPress(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.roomId && this.messageText && this.messageText != '') {
      this.chatService.sendMessage(this.messageText, this.roomId,
        '', null, '', null, null).flatMap(() => {
          this.messageText = '';
          return this.chatService.getProjectChartHistory(this.roomId);
        }).subscribe((messages: ChatMessageModel[]) => {
          this.loadMessages(messages);
          setTimeout(() => {
            this.scrollbar.directiveRef.scrollToBottom();
          }, 1);
        });
    }
  }

  chatbottomoptionsHgt() {
    this.viewHeight = this.chatbottomoptions.nativeElement.offsetHeight + 10;
    this.chatmessagesHgt.nativeElement.style.height = "calc(100% - " + this.viewHeight + "px)";

  }

}
