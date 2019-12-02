import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from 'app/core/api/api.service';


/**
 * CFM service
 * Use for push notifications
 */
@Injectable()
export class MessagingService {

  messaging;
  currentMessage;

  constructor(
    private afAuth: AngularFireAuth,
    private api: ApiService
  ) {
    this.messaging = firebase.messaging();
    this.currentMessage = new BehaviorSubject(null);
  }

  updateToken(token) {
    this.afAuth.authState.subscribe((user) => { });

    if (!localStorage.getItem('fcm_token') || localStorage.getItem('fcm_token') != token) {
      localStorage.setItem('fcm_token', token);
      this.api.post(
        `devices`,
        { 'registration_id': token, 'type': 'web' }
      ).subscribe();
    }
  }

  getPermission() {
    if ('serviceWorker' in navigator) {
      this.messaging.requestPermission()
      .then(() => {
        // Notification permission granted
        return this.messaging.getToken();
      })
      .then((token) => {
        this.updateToken(token);
      })
      .catch((err) => {
        // Unable to get permission to notify.
      });
    }
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      // Message received
      this.currentMessage.next(payload)
    });
  }
}
