import { Injectable } from '@angular/core';

@Injectable()
export class CropperService {

  constructor() { }
  cropData:any = [];

  cropImage(img, w, h, nw,nh, ratio, cropType):any{
    let tmpcanvas = document.createElement("canvas");
    let tmpcontext = tmpcanvas.getContext('2d');
    tmpcanvas.width = nw;
    tmpcanvas.height = nh;

    let ogcanvas = document.createElement("canvas");
    let ogcontext = ogcanvas.getContext("2d");
    ogcanvas.width = w;
    ogcanvas.height = h;
    ogcontext.drawImage(img,0,0);

    let reqX = ogcanvas.width / 2 - nw/2;
    let reqY = ogcanvas.height / 2 -nh/2;

    tmpcontext.drawImage(ogcanvas,0,0,w,h);

    this.cropData.push({"uri":tmpcanvas.toDataURL(), "width":nw, "height":nh, "type":cropType});
    
    return tmpcanvas.toDataURL();
  }

  getCropData(){
    return this.cropData;
  }

  clearData(){
    this.cropData = [];
  }
}
