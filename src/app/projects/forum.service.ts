import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { CategoryInfo, ThreadInfo } from 'app/projects/models/forum-info-model';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class ForumService {

  constructor(private api: ApiService) { }

  getCategoryList(): Observable<CategoryInfo[]> {
    return this.api.get<CategoryInfo[]>('forum-category');
  }

  getThreadInfoList(categoryId?: number, startPage?, pageSize?, searchText?, isMostView?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      if (categoryId && !isMostView) {
        return this.api.get<any[]>(`forum-category/${categoryId}/thread_list`, { offset: offset, limit: pageSize, title: title, search: searchText });
      }
      else if (categoryId && isMostView) {
        return this.api.get<any[]>(`forum-category/${categoryId}/thread_mostviewlist`, { offset: offset, limit: pageSize, title: title, search: searchText });
      }
      else if (!categoryId && isMostView) {
        return this.api.get<any[]>(`forum-mostview`, { offset: offset, limit: pageSize, title: title, search: searchText });
      }
      return this.api.get<any[]>(`forum`, { offset: offset, limit: pageSize, title: title, search: searchText });
    }
    return this.api.get<any[]>(`forum`);
  }

  getTopicInfoList(): Observable<any[]> {
    return this.api.get<any[]>(`forum-topics`);
  }

  getTopicsTreadInfoList(topicId?: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      return this.api.get<any>(`forum-topics/${topicId}/thread_list`, { offset: offset, limit: pageSize, title: title, search: searchText });
    }
    return this.api.get<any>(`forum-topics/${topicId}/thread_list`);
  }

  getForumUserInfoList(): Observable<any> {
    return this.api.get<any>(`forum_user_list`);
  }
  getCreatorUserInfoList(): Observable<any> {
    return this.api.get<any>(`accounts/profile/creators`);
  }

  postNewThread(data: ThreadInfo): Observable<any> {
    return this.api.post(`forum`, data);
  }

  getForumUserThreadList(id: number): Observable<any> {
    return this.api.get<any>(`forum_user_thread`, { user_id: id });
  }

  savePostsAgainstThread(data): Observable<any> {
    return this.api.post(`forum-comments`, data);
  }

  setThreadViewCount(id): Observable<any> {
    return this.api.get(`forum-comments`, { thread_id: id });
  }

  getTreadInfoByIdList(threadId?: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      return this.api.get<any>(`forum/${threadId}/comment_list`, { offset: offset, limit: pageSize, title: title, search: searchText });
    }
    return this.api.get<any>(`forum/${threadId}/comment_list`);
  }

}
