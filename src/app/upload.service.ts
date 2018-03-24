import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable()
export class UploadService {

  constructor(private http:HttpClient) { }

  uploadImages(uri:any){
    return this.http.post("/", {"data":uri});
  }

}
