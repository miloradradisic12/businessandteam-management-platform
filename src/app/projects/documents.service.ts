import {Injectable} from '@angular/core';
import {RequestOptions, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {AuthHttp} from 'angular2-jwt';
import FormData from 'formdata-polyfill/formdata.min';

import {ApiService} from 'app/core/api/api.service';
import DocumentModel from 'app/core/models/DocumentModel';
import {environment} from 'environments/environment';


/**
 * Service for working with documents.
 */
@Injectable()
export class DocumentsService {
  constructor(
    private api: ApiService,
    private authHttp: AuthHttp
  ) {
  }

  /**
   * Get document object.
   * @param documentId
   * @returns observable of object with document name, extension and download path
   */
  get(documentId: number) {
    return this.api.get<DocumentModel>(`idea/task/documents/${documentId}`);
  }

  /**
   * Change document name
   * @param name - new name
   * @param documentId
   * @returns observable
   */
  rename(name: string, documentId: number) {
    return this.api.patch(`idea/task/documents/${documentId}`, {name: name});
  }

  /**
   * Delete document
   * @param documentId
   * @returns observable
   */
  delete(documentId: number) {
    return this.api.delete(`idea/task/documents/${documentId}`);
  }

  /**
   * Download document
   * @param url
   * @returns observable
   */
  getDocument(url: string) {
    const options = new RequestOptions({responseType: ResponseContentType.Blob });

    return this.authHttp.get(`${environment.server}/${url}`, options)
      .map((response) => response.blob());
  }

  /**
   * Upload document
   * @param document - document body
   * @param documentId
   * @returns observable
   */
  saveDocument(document: FormData, documentId: number) {
    return this.api.patch(`idea/task/documents/${documentId}`, document._blob());
  }

  createDocument(data: FormData) {
    return this.api.post('idea/task/documents', data._blob());
  }

  createOCRDocument(file, handwriting: boolean, isWorkArea: boolean): Observable<any> {
    let data = JSON.stringify({
      image: file,
      handwriting: handwriting,
      workarea: isWorkArea
    });
    return this.api.post(`ocr/read-image`, data);
  }
}
