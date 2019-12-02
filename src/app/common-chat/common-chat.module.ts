import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from 'app/collaboration/chat.service';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { ProjectRoomComponent } from './chat-room/project-room/project-room.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    MyPrimeNgModule,
    FormsModule,
    PerfectScrollbarModule.forRoot()
  ],
  declarations: [ChatRoomComponent, ProjectRoomComponent],
  exports: [ChatRoomComponent],
  providers: [ChatService]
})
export class CommonChatModule { }
