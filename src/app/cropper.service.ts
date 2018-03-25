import { Injectable } from '@angular/core';

@Injectable()
export class CropperService {

  constructor() { }

  //Stores the details of the croppedImages
  //Basic structure of cropData will be
  /* 
    [{
      "uri": "data:image/png:.........",
      "type": "Horizontal",
      "width": X,
      "height": Y

    },
    {
      "uri": "data:image/png:........."
      "type": "Vertical",
      "width": X,
      "height": Y
    }
    .
    .
    .
    .
    ]
  */
  cropData:any = [];

  //Function which crops the image
  cropImage(img, w, h, nw,nh, ratio, cropType):any{
    //Sets up a canvas for the cropped image
    let tmpcanvas = document.createElement("canvas"); 
    let tmpcontext = tmpcanvas.getContext('2d');
    tmpcanvas.width = nw;
    tmpcanvas.height = nh;

    //Sets up a canvas for the original image
    let ogcanvas = document.createElement("canvas");
    let ogcontext = ogcanvas.getContext("2d");
    ogcanvas.width = w;
    ogcanvas.height = h;
    ogcontext.drawImage(img,0,0); //draw the original image onto the canvas

    //draw the cropped image to the canvas
    tmpcontext.drawImage(ogcanvas,0,0,w,h);

    //Add an entry to the cropData array for the current image
    this.cropData.push({"uri":tmpcanvas.toDataURL(), "width":nw, "height":nh, "type":cropType});
  }

  //Returns the cropData array
  getCropData(){
    return this.cropData;
  }

  //Clears the cropData array
  clearData(){
    this.cropData = [];
  }
}
