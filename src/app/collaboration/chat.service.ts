import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';

import {ApiService} from 'app/core/api/api.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {environment} from 'environments/environment';

import {ChatRoomModel, ChatCredentialsModel, ChatMessageModel} from './models';


/**
 * Service for working with Rocket.Chat.
 */
@Injectable()
export class ChatService {
  cachedCredentials: ChatCredentialsModel;
  cachedUsers: _.Dictionary<UserProfileModel>;

  constructor(
    private apiService: ApiService,
    private http: Http
  ) {
    this.cachedUsers = {};
  }

  /**
   * Get user credentials for connection to chat.
   *
   * @returns object with user_id and token to connect Rocket.Chat
   */
  getChatCredentials(): Observable<ChatCredentialsModel> {
    if (this.cachedCredentials) {
      return Observable.of(_.cloneDeep(this.cachedCredentials));
    }
    return this.apiService.get('chat/token').map((credentials: ChatCredentialsModel) => {
      this.cachedCredentials = credentials;
      return _.cloneDeep(credentials);
    });
  }

  getChatUser(userId): Observable<UserProfileModel> {
    const cached = this.cachedUsers[userId];
    if (cached) {
      return Observable.of(_.cloneDeep(cached));
    }
    return this.apiService.get(`chat/user/profile/${userId}`)
      .map((user: {user}) => {
        this.cachedUsers[userId] = user.user;
        return _.cloneDeep(user.user);
      });
  }

  /**
   * Get chat room information which refers to a sub-task.
   *
   * @param taskId - sub-task (process) identifier
   */
  getChatRoom(taskId): Observable<ChatRoomModel> {
    return this.apiService.get(`chat/task/${taskId}`);
  }

  /**
   * Send message to a chat room.
   *
   * @param message - message body
   * @param roomId - Rocket.Chat room id
   */
  sendMessage(message, roomId, messageType, attachments, emoji, decisionPollSelectedList, parent_message_id) {
    //return this.post('chat.postMessage', {roomId: roomId, text: message});    
    return this.post('post-msg', {roomId: roomId, text: message, messageType: messageType, attachments: attachments, emoji: emoji, options: decisionPollSelectedList, parent_message_id: parent_message_id});
  }

  /**
   * Get chat room history.
   *
   * @param roomId - Rocket.Chat room id
   */
  getChatHistory(roomId): Observable<ChatMessageModel[]> {
    return this.get('groups.history', {roomId: roomId}).map((response) => {
      const data = response.json();
      if (data && data.messages) {
        return data.messages
          .filter((message) => {
            return message.u.username !== 'rocket';
          })
          .map((message: any) => {
            return {
              id: message._id,
              text: message.mentions && message.mentions.length > 0 ? message.msg.indexOf(message.mentions[0].username) > -1 ? message.msg.split(message.mentions[0].username)[1] : 
                    message.msg : message.urls && message.urls.length > 0 && message.msg.indexOf(message.urls[0].url) > -1 ? message.msg.split(message.urls[0].url+')')[1] : message.msg,
              time: moment(message.ts).toDate(),
              userId: message.u._id,
              name: message.u.name,
              username: message.u.username,
              user: null,
              message_type: message.message_type,
              attachments: message.attachments,
              is_reply: message.is_reply ? message.is_reply : false,
              //options: message.options && message.options.length > 0 ? message.options : []
              options: message.voting_result && message.voting_result.length > 0 ? message.voting_result : message.options && message.options.length > 0 ? message.options : []
            } as ChatMessageModel;
          });
      }
      return [];
    });
  }

  /**
   * Do GET request to the chat server
   */
  protected get(path: string, params?: any): Observable<any> {
    /*return this.getChatCredentials().flatMap((user) => {
      const headers = new Headers();
      headers.append('X-Auth-Token', user.token);
      headers.append('X-User-Id', user.user_id.toString());
      return this.http.get(`${environment.rocketchat_api}/${path}`, {
        headers: headers,
        params: params
      });
    });*/
    return this.getChatCredentials().flatMap((user) => {
      let body = JSON.stringify({
        header : {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString()
        },
        roomId: params.roomId
      });
      return this.http.post(`${environment.server}/group-history/`, body);
    });
  }

  /**
   * Do POST request to the chat server
   */
  protected post(path: string, data: any): Observable<any> {
    /*return this.getChatCredentials().flatMap((user) => {
      const headers = new Headers();
      const options: RequestOptionsArgs = <RequestOptionsArgs>{};
      headers.append('X-Auth-Token', user.token);
      headers.append('X-User-Id', user.user_id.toString());
      options.headers = headers;

      let body = JSON.stringify({
        text: data.text,
        roomId: data.roomId,
        message_type: data.messageType,
        attachments: data.attachments,
        emoji: data.emoji,
        parent_message_id: null,
        options: data.options
      });

      //return this.http.post(`${environment.rocketchat_api}/${path}`, data, {headers: headers});
      return this.http.post(`${environment.server}/${path}/`, body, options);
    });*/

    return this.getChatCredentials().flatMap((user) => {
      let body = JSON.stringify({
        header : {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString()
        },
        text: data.text,
        roomId: data.roomId,
        message_type: data.messageType,
        attachments: data.attachments,
        emoji: data.emoji,
        parent_message_id: data.parent_message_id,
        options: data.options
      });
      return this.http.post(`${environment.server}/${path}/`, body);
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

  postFormData(roomId:any,messageType:any,data:any):Observable<any>{
    return this.getChatCredentials().flatMap((user) => {
      let file2 = this.dataURLtoFile(data,'yakko');
      let fd = new FormData();
      fd.append('file',file2);
      return this.http.post(`${environment.server}/upload/`, fd, 
          {headers: new Headers({
            'X-Auth-Token': user.token,
            'X-User-Id': user.user_id.toString(),
            'messageType':messageType,
            roomId: roomId
          })
        });
    });
  }

  postSelectedPollOption(data: any): Observable<any> {
    const body = data;
    return this.apiService.post(`poll-voting`, body);
  }

  postUploadAttachment(messageType, messageText, sourceAttachment, room_id): Observable<any>{
    return this.getChatCredentials().flatMap((user) => {
      let body = JSON.stringify({
        header : {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString()
        },
        text: messageText,
        roomId: room_id,
        message_type: messageType,
        file: sourceAttachment.file,
        filename: sourceAttachment.title,
      });

      return this.http.post(`${environment.server}/upload/`, body);
    });
  }

  postShowInterest(fundId): Observable<any> {
    return this.getChatCredentials().flatMap((user) => {
      let body = JSON.stringify({
        header : {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString()
        },
        fund: fundId
      });
      return this.http.post(`${environment.server}/show-interest/`, body);
    });
  }

  getAllChatRooms(): Observable<any> {
    return this.getChatCredentials().flatMap((user) => {

      const options = <RequestOptionsArgs>{
        params: //JSON.stringify(
          {
          //header : {
            'X-Auth-Token': user.token,
            'X-User-Id': user.user_id.toString()
          //}
        }
      //)
      };
      
      /*const headers = new Headers();
      const options: RequestOptionsArgs = <RequestOptionsArgs>{};
      headers.append('X-Auth-Token', user.token);
      headers.append('X-User-Id', user.user_id.toString());
      options.headers = headers;*/
    
      return this.http.get(`${environment.server}/direct-room-list/`, options).map(response => {
        return response.json();
      });
    });
  }

  getProjectChartHistory(roomId: any): Observable<ChatMessageModel[]> {
    return this.getChatCredentials().flatMap((user) => {

      let body = JSON.stringify({
        header : {
          'X-Auth-Token': user.token,
          'X-User-Id': user.user_id.toString()
        },
        roomId: roomId
      });
      return this.http.post(`${environment.server}/im-history/`, body).map(response => {
        //return response.json();
        const data = response.json();
      if (data && data.messages) {
        return data.messages
          .filter((message) => {
            return message.u.username !== 'rocket';
          })
          .map((message: any) => {
            return {
              id: message._id,
              text: message.mentions && message.mentions.length > 0 ? message.msg.indexOf(message.mentions[0].username) > -1 ? message.msg.split(message.mentions[0].username)[1] : 
                    message.msg : message.urls && message.urls.length > 0 && message.msg.indexOf(message.urls[0].url) > -1 ? message.msg.split(message.urls[0].url+')')[1] : message.msg,
              time: moment(message.ts).toDate(),
              userId: message.u._id,
              name: message.u.name,
              username: message.u.username,
              user: null,
              message_type: message.message_type,
              attachments: message.attachments,
              is_reply: message.is_reply ? message.is_reply : false,
              //options: message.options && message.options.length > 0 ? message.options : []
              options: message.voting_result && message.voting_result.length > 0 ? message.voting_result : message.options && message.options.length > 0 ? message.options : [],
              flag: message.flag && message.flag != null ? message.flag : false
            } as ChatMessageModel;
          });
      }
      return [];
      });
    });
  }

}
