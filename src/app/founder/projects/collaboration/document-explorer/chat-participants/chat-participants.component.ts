import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbPopover, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import TaskModel from 'app/core/models/TaskModel';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { AccountService } from 'app/founder/account/account.service';


@Component({
  selector: 'app-chat-participants',
  template: `
    <div class="participants">
      <div *ngFor="let participant of participants">
        <img class="photo" [src]="participant.photo_crop || ''"/>
      </div>      
      <span>{{process.process_percentage}} % </span>
      <button class="btn" *ngIf="!is_complete && process.process_percentage >= 100" (click)="showConfirmationMessage()"> Reassign</button>
    </div>
    <ng-template #popUpForConfirmationMessage>
      <div class="modal-body">Are you sure you want to reassign process?</div>
      <div class="modal-footer">
        <div class="buttons">
          <div class="btn btn-ok" (click)="reassignTask()">Yes</div>
        </div>
        <div class="buttons">
          <div class="btn btn-ok" (click)="popUpForShowInterestModalRef.close()">No</div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .participants {
      display: flex;
      align-items: center;
      height: 38px;
    }
    .photo {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      margin-left: 6px;
    }
    @media only screen and (max-width: 992px) {
      .participants {
        height: 24px;
      }
      .photo {
        height: 24px;
        width: 24px;
        margin-left: -12px;
      }
    }
  `]
})
export class ChatParticipantsComponent implements OnInit {
  @Input() process: TaskModel;
  @Input() is_complete: boolean;
  @Output() reassignProcess = new EventEmitter<number>();
  @ViewChild('popUpForConfirmationMessage') popUpForConfirmationMessage;
  popUpForShowInterestModalRef: NgbModalRef;

  participants: UserProfileModel[];

  constructor(private accountService: AccountService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.accountService.getEmployees().subscribe((employees: UserProfileModel[]) => {
      this.participants = employees.filter((employee) => this.process.participants.includes(employee.id));
    });
  }

  showConfirmationMessage() {
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForConfirmationMessage, {backdrop: false});
  }

  reassignTask() {
    this.popUpForShowInterestModalRef.close();
    this.reassignProcess.emit(this.process.id);
  }
}
