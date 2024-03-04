import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  uploadSingle(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.SERVER_URL + '/upload-image/single', formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
