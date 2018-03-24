import {
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UploadService } from './upload.service';
import { CropperService } from './cropper.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UploadService]
})


export class AppComponent {
  @ViewChild('file') fileSelector: ElementRef;

  constructor(private upload:UploadService, private cropper:CropperService, private sanitizer:DomSanitizer){

  }
  data: any;
  processed:any = false;
  loading = false;
  active = -1;
  links:any = [];
  cropSize:any = {
    "Horizontal":{
        "width": 755,
        "height": 450,
    },
    "Vertical":{
      "width":365,
      "height":450,
    },
    "hSmall":{
      "width":365,
      "height":212,
    },
    "Gallery":{
      "width":380,
      "height":380,
    }
  }

  cropData:any = [];
  selectedURI = null;
  selectedType = null;

  clearImage(){
    this.selectedURI = null;
    this.cropData = [];
    this.cropper.clearData();
    this.processed = false;
    this.active = -1;
    this.links = [];
    this.data = "";
  }
  process(): any {
    this.fileSelector.nativeElement.click();
  }

  processFile(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      var mime = this.fileSelector.nativeElement.files[0].type;

      switch (mime) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
          this.verifyImage(reader);
          reader.readAsDataURL(e.target.files[0]);
          break;
        default:
          alert("Please upload a valid image file");
      }

    } else {
      this.data = "";
      this.cropData = [];
      alert("No image selected!");

    }
  }

  verifyImage(r: FileReader) {
    r.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        let ratio = width/height;
        if (width == 1024 && height == 1024) {
          this.data = img.src;
          let hImg = this.cropper.cropImage(img,width,height,this.cropSize.Horizontal.width,this.cropSize.Horizontal.height, ratio, "Horizontal");
          let vImg = this.cropper.cropImage(img,width,height,this.cropSize.Vertical.width,this.cropSize.Vertical.height, ratio ,"Vertical");
          let hsImg = this.cropper.cropImage(img,width,height,this.cropSize.hSmall.width,this.cropSize.hSmall.height, ratio, "Horizontal-Small");
          let gImg = this.cropper.cropImage(img,width,height,this.cropSize.Gallery.width,this.cropSize.Gallery.height, ratio, "Gallery");

          this.cropData = this.cropper.getCropData();
          this.processed = true;
        } else {
          alert("Please upload an image of size 1024 x 1024");
        }
      }
    }
  }

  

  setCropImage(uri,type,n){
    this.selectedURI = uri;
    this.selectedType = type;
    this.active = n;
  }

  sendData(){
    if(this.selectedURI.length && this.selectedType){
      this.loading = true;
      this.links = [];      
      let imageArr = [];
      imageArr.push({"uri":this.selectedURI, "type":this.selectedType});
      this.upload.uploadImages(imageArr).subscribe((res:any)=>{
        this.loading = false;
        res.link.forEach(el => {
          this.links.push(el)
        }); 
        console.log(res.link);
      })
    }
  }

  sanitizeUrl(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  sendAllData(){
    if(this.cropData){
      this.links = [];
      let imageArr = [];
      this.loading = true;
      this.cropData.forEach(img => {
        imageArr.push({"uri":img.uri, "type":img.type});
      });
      console.log(imageArr);
      this.upload.uploadImages(imageArr).subscribe((res:any)=>{
        this.loading = false;
        res.link.forEach(el => {
          this.links.push(el)
        });    
        console.log(this.links);    
      })
    }
  }
}

