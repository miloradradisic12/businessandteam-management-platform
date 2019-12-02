import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  roomList: any;
  selectedIntex: number;
  selectedRoomId: string;
  selectGroupName: string;

  chatscrfullvar:boolean=false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.getAllChartRooms();
    
  }

  getAllChartRooms() {
    this.chatService.getAllChatRooms().subscribe(rooms => {
      this.roomList = rooms;
      if(this.roomList.ims && this.roomList.ims.length > 0) {
        this.selectedGroup(this.roomList[0].ims._id, this.roomList[0].ims.username);
      }
      
    });
  }

  onTabOpen(e) {
    this.selectedIntex = e.index;
  }

  onTabClose(e) {
    if (this.selectedIntex == e.index) {
      this.selectedIntex = null;
    }
  }

  selectedGroup(id, groupName) {
    this.selectedRoomId = id;
    this.selectGroupName = groupName;
  }
  checkchatscrfun(){
    this.chatscrfullvar=!this.chatscrfullvar;
  }

}
