import {HttpModule} from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { UploadService } from './upload.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CropperService } from './cropper.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    
  ],
  providers: [UploadService, CropperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
