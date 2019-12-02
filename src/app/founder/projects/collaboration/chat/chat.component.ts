import { Component, OnDestroy, OnInit, ViewChild,ElementRef,AfterViewChecked,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as _ from 'lodash';
import { NgbPopover, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ChatService } from 'app/collaboration/chat.service';
import TaskModel from 'app/core/models/TaskModel';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { ChatRoomModel, ChatMessageModel, AttachmentMessageModel, ChatCredentialsModel, DecisionPollOption } from 'app/collaboration/models';
import { TasksService } from 'app/projects/tasks.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-processes-chat',
  templateUrl: './chat.component.html',
  styleUrls: [
    'chat.component.scss'
  ]
})
export class DocumentChatComponent implements OnInit, OnDestroy,AfterViewChecked {
  @ViewChild(PerfectScrollbarComponent) scrollbar: PerfectScrollbarComponent;
  @ViewChild('chatbottomoptions') chatbottomoptions: ElementRef;
  @ViewChild('chatmessagesHgt') chatmessagesHgt: ElementRef;
  

  viewHeight: number;
  isProcessesOpen: boolean = false;	
  process: TaskModel;
  messages: ChatMessageModel[];
  messagesUser: {msgUserId:string, user:UserProfileModel}[] = [];
  messageText: string;
  chatRoom: ChatRoomModel;
  isChatOpen = false;
  timerId: any;
  activeMobileView: null | 'chat' | 'menu' | 'documents';
  messageType: string;
  emoji: string;
  attachments: any[];
  dropZoneChartTemplate: string;
  sourceText: string;
  drawingText: string;
  sourceAttachment: AttachmentMessageModel;
  drawingAttachment: AttachmentMessageModel;
  credentials: ChatCredentialsModel;
  popoverTimerList = {};
  decisionPollSelectedList: DecisionPollOption[];
  parent_message_id: string;
  selectedOption: number;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForConfirmationMessage') popUpForConfirmationMessage;
  is_complete: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    //this.process = new TaskModel();
    this.messages = [];
    this.messageText = '';
    this.sourceText = '';
    this.drawingText = '';
    this.chatRoom = null;
    this.activeMobileView = null;
    this.messageType = '';
    this.emoji = '';
    this.attachments = [];
    //this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport" style="height: 45px; width: 250px; background: #fff; border: 1px solid #ccc; display: block;"></div>`;
    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.credentials = new ChatCredentialsModel();
    this.decisionPollSelectedList = [];
    this.selectedOption = 0;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.resetValues();
      this.messageType = '';
      this.process = new TaskModel();
      this.chatRoom = new ChatRoomModel();
      const processId = params['processId'];
      this.activeMobileView = params['view'] || null;

      this.chatService.getChatCredentials().subscribe(credentials => {
        this.credentials = credentials;
        this.tasksService.get(processId).flatMap((process) => {
          this.process = process;
          this.tasksService.getDepend((process.id)).subscribe((info)=>{
            this.is_complete = info.is_complete;
          });
          return this.chatService.getChatRoom(process.id);
        }).flatMap((chatRoom: ChatRoomModel) => {
          this.chatRoom = chatRoom;
          return this.chatService.getChatHistory(chatRoom.room_id);
        }).subscribe((messages: ChatMessageModel[]) => {
          this.loadMessages(messages);
          this.scrollbar.directiveRef.scrollToBottom();
          this.timerId = setInterval(() => {
            this.updateMessages();
          }, 3000);
  
        });
      }, (error)=>{
        console.log(error);
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, {backdrop: false});
      });
    });
    this.chatbottomoptionsHgt();
  }
  ngAfterViewChecked()	
  {
    this.cdr.detectChanges();
    this.viewHeight = this.chatbottomoptions.nativeElement.offsetHeight;
   // this.chatbottomoptionsHgt();
  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  openChat() {
    this.isChatOpen = !this.isChatOpen;
    setTimeout(() => {
      this.scrollbar.directiveRef.scrollToBottom();
    }, 1);
  }

  onTextInputKeyPress(event: KeyboardEvent, messageType?: string) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendMessage(messageType);
    }
  }

  sendMessage(messageType?: string) {
    if (this.chatRoom) {
      if (this.messageText != '' && this.messageType != '') {
        if (this.messageType == 'decision_poll') {
          if (this.validateDecisionPoll()) {
            this.sendMsg();
          }
        }
        else {
          this.sendMsg();
        }
      }
    }
  }

  sendMsg() {
    this.chatService.sendMessage(this.messageText, this.chatRoom.room_id,
      this.messageType, this.attachments, this.emoji, this.decisionPollSelectedList,
      this.parent_message_id).flatMap(() => {
        return this.chatService.getChatHistory(this.chatRoom.room_id);
      }).subscribe((messages: ChatMessageModel[]) => {
        this.resetValues();
        this.messageType = '';
        this.loadMessages(messages);
        // setTimeout(() => {
        //   this.scrollbar.directiveRef.scrollToBottom();
        // }, 1);
        setTimeout(()=>{ 
          this.chatbottomoptionsHgt();
        },1);
      });
  }

  validateDecisionPoll() {
    if (this.decisionPollSelectedList.length > 0) {
      return !(this.decisionPollSelectedList.findIndex(a => a.option == '') > -1);
    }
    else {
      return false;
    }
  }

  updateMessages() {
    return this.chatService.getChatHistory(this.chatRoom.room_id)
      .subscribe((messages) => this.loadMessages(messages));
  }

  loadMessages(messages: ChatMessageModel[]) {
    let temp = _.orderBy(messages, 'time');
    if(this.messages && this.messages.length != temp.length){
      let narray = _.filter(
        temp, (x) => !_.find(this.messages, (q) => q.id === x['id'])
      );

      for(const msg of narray)
      {
        if(msg.attachments){
          msg.attachments.forEach((item)=>{
            item.image_preview = `data:${item.image_type};base64,${item.image_preview}`;
            item.image_url = `${environment.rocketchat_api}${item.image_url}`;
          })
        }
        this.getMessageUser(msg);
        this.messages.push(msg);
      }
    }
  }

  getMessageUser(msg:ChatMessageModel){
    let u = _.find(this.messagesUser,(u)=>u.msgUserId == msg.userId);
    if(u){
      msg.user = u.user;
    }
    else{
      this.chatService.getChatUser(msg.userId).subscribe((user) => {
        this.messagesUser.push({msgUserId:msg.userId,user:user});
        msg.user = user;
      });
    }
  }

  // TODO: implement on the backend field full_name for user profile
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

  selectedDrawingAttachment(event: any) {
    this.drawingAttachment = event;
  }

  selctedSourceAttachment(event: any) {
    //this.sourceAttachment = event;
    this.chatService.postFormData(this.chatRoom.room_id,this.messageType,event.file).flatMap(() => {
        return this.chatService.getChatHistory(this.chatRoom.room_id);
      }).subscribe((messages: ChatMessageModel[]) => {
        this.resetValues();
        this.messageType = '';
        this.loadMessages(messages);
        // setTimeout(() => {
        //   this.scrollbar.directiveRef.scrollToBottom();
        // }, 1);
        setTimeout(()=>{ 
          this.chatbottomoptionsHgt();
        },1);
      });
     
  }

  setMessageType(messageType: string) {
    this.messageType = messageType;
    this.resetValues();
    if (messageType == 'decision_poll') {
      for (let index = 0; index < 3; index++) {
        const option = {
          id: Math.floor(Math.random() * (200 - 20 + 1)),
          option: '',
          addOption: index == 0 ? true : false
        } as DecisionPollOption;
        this.decisionPollSelectedList.push(option);
      }
    }
    
    setTimeout(()=>{ 
      this.chatbottomoptionsHgt();
    },500);

  }
  chatbottomoptionsHgt()
  {
    this.viewHeight = this.chatbottomoptions.nativeElement.offsetHeight+10;
    this.chatmessagesHgt.nativeElement.style.height = "calc(100% - "+ this.viewHeight + "px)";
  }
  addPollOption(event) {
    const option = {
      id: Math.floor(Math.random() * (200 - 20 + 1)),
      option: '',
      addOption: false
    } as DecisionPollOption;
    this.decisionPollSelectedList.push(option);
  }

  removePollOption(event) {
    this.decisionPollSelectedList.splice(this.decisionPollSelectedList.findIndex(a => a == event), 1);
  }

  resetValues() {
    this.messageText = '';
    //this.messageType = '';
    this.sourceText = '';
    this.drawingText = '';
    this.emoji = '';
    this.sourceAttachment = new AttachmentMessageModel();
    this.drawingAttachment = new AttachmentMessageModel();
    this.decisionPollSelectedList = [];
    this.parent_message_id = '';
    this.attachments = [];
    this.selectedOption = 0;
  }

  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName) {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }

  setDataForResponse(message: ChatMessageModel, popover) {
    popover.open();
  }

  assumptionMsg(event) {
    this.messageText = event;
    this.sendMsg();
  }

  thoughExperimentMsg(event) {
    this.messageText = event;
    this.sendMsg();
  }

  hypothesisMsg(event) {
    this.messageText = event;
    this.sendMsg();
  }

  postADR(messageText: string, message: ChatMessageModel, popover) {
    this.parent_message_id = message.id;
    let data = {
      text: message.text,
      author_name: message.username,
      ts: message.time,
      message_link: `${environment.rocketchat_api}/group/${this.chatRoom.title}?msg=${message.id}`,
      translations: null,
    } as AttachmentMessageModel;
    this.attachments.push(data);
    this.messageType = '';
    this.messageText = messageText;
    this.sendMsg();
    popover.close();
  }

  selectedPollOption(id: number, message: ChatMessageModel) {
    this.chatService.postSelectedPollOption({ message_id: message.id, options: id }).subscribe((obj) => {
      this.resetValues();
      this.messageType = '';
      this.updateMessages();
    });
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }

  reassignProcessEvent(event) {
    this.process.is_reassign = true;
    this.tasksService.updateTask(event, this.process).subscribe((taskInfo)=>{      
    });
  }

  isProcessComplete(event) {
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForConfirmationMessage, {backdrop: false});
  }

  isComplete() {    
    if (this.is_complete) {
      this.process.is_complete = this.is_complete;
      this.process.is_creator = true;
      this.tasksService.updateTask(this.process.id, this.process).subscribe((taskInfo)=>{
        this.popUpForShowInterestModalRef.close();
      });
    }
  }
}
