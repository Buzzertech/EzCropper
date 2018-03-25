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

  constructor(private upload:UploadService, private cropper:CropperService, private sanitizer:DomSanitizer){}

  @ViewChild('file') fileSelector: ElementRef; //Reference to the file input
  data: any; //variable stores the original image 
  processed:any = false; //boolean to note if images have been cropped
  loading = false; //boolean to note if the images have been uploaded or no
  active = -1;
  links:any = []; //an array which stores all the links to the images after sending them to the server
  cropData:any = []; //this array stores the cropped data
  selectedURI = null; //variable stores the selected image's uri
  selectedType = null; //variable stores the selected image's type i.e. Horizontal, vertical, gallery, etc.

  //variable cropsize
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

  //Clear the image selected
  clearImage(){
    this.selectedURI = null;
    this.cropData = [];
    this.cropper.clearData();
    this.processed = false;
    this.active = -1;
    this.links = [];
    this.data = "";
  }

  //triggers the click event on the hidden input
  process(): any {
    this.fileSelector.nativeElement.click();
  }

  //after selecting the image process the image
  processFile(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      var mime = this.fileSelector.nativeElement.files[0].type;

      //Check if image is an image
      switch (mime) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
          this.verifyImage(reader); //verify it further
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

  //Verifies the width and height of the images and calls the crop function
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

          //Below are crop functions which call the cropImage() function in the cropper.service.ts
          //To add further more sizes just add another object to the cropSize array and add it like below
          // this.cropper.cropImage(img, w, h, cropW, cropH, ratio, type);
          /*
            In the above syntax:
            img - image to be cropped
            w - width of the original image, h - height of the original image
            cropW - cropped width of the image, cropH - cropped height of the image
            ratio - ratio of the image i.e. w divided by h
            type - a string which denotes the name of the cropped image for eg. Horizontal, vertical, thumbnail, etc.
          */
         try{
          this.cropper.cropImage(img,width,height,this.cropSize.Horizontal.width,this.cropSize.Horizontal.height, ratio, "Horizontal"); 
          this.cropper.cropImage(img,width,height,this.cropSize.Vertical.width,this.cropSize.Vertical.height, ratio ,"Vertical");
          this.cropper.cropImage(img,width,height,this.cropSize.hSmall.width,this.cropSize.hSmall.height, ratio, "Horizontal-Small");
          this.cropper.cropImage(img,width,height,this.cropSize.Gallery.width,this.cropSize.Gallery.height, ratio, "Gallery");
          //This function gets the cropped image data from the cropper service
          this.cropData = this.cropper.getCropData();

          //Now we set the processed boolean to true so that we can remove the .upload-window from the DOM
          this.processed = true;
         }catch(err){
           alert(err.message);
         }
        } else {
          alert("Please upload an image of size 1024 x 1024"); //fallback if image isn't of size 1024x1024
        }
      }
    }
  }

  //When a particular image is clicked, this function is called which stores the image's uri, type (i.e. horizontal, vertical, etc)
  //Also sets the active class to the selected image 
  setCropImage(uri,type,n){
    this.selectedURI = uri;
    this.selectedType = type;
    this.active = n;
  }

  //When only one image is selected, this function is called on clicking the "Upload" button
  //This function sends the image uri and the type to the server for storing it to the server
  sendData(){
    if(this.selectedURI.length && this.selectedType){
      this.loading = true;
      this.links = [];      
      let imageArr = []; //local array which stores the image data to be sent
      imageArr.push({"uri":this.selectedURI, "type":this.selectedType});
      this.upload.uploadImages(imageArr).subscribe((res:any)=>{
        this.loading = false;
        res.link.forEach(el => {
          this.links.push(el); //on receiving the data from the server we get an array of links and the crop type which is used to display the links of different images stored on server
        }); 
       
      })
    }
  }

  //Sanitizes the image
  sanitizeUrl(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //If upload all btn is clicked, this function is fired
  //This function loops through the cropData array and pushes the uri and type of each image
  //to the local variable "imageArr[]"
  sendAllData(){
    if(this.cropData){
      this.links = [];
      let imageArr = [];
      this.loading = true;
      this.cropData.forEach(img => {
        imageArr.push({"uri":img.uri, "type":img.type});
      });
      this.upload.uploadImages(imageArr).subscribe((res:any)=>{
        this.loading = false;
        res.link.forEach(el => {
          this.links.push(el); //on receiving the data from the server we get an array of links and the crop type which is used to display the links of different images stored on server
        });    
        console.log(this.links);    
      })
    }
  }
}

