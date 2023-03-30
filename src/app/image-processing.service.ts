import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './_model/file-handle.model';
import { Product } from './_model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }
  public createImages(product: Product) {
    const productImages: any[] = product.productImages;

    const productImagesToFileHandle: FileHandle[] = [];

    for (let i = 0; i < productImages.length; i++) {
      const imageFileData = productImages[i];

      const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);
      const imageFile = new File([imageBlob], imageFileData.name, { type: imageFileData.type });
      const finalFileHandle: FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      productImagesToFileHandle.push(finalFileHandle);
    }

    product.productImages = productImagesToFileHandle;
    return product;
  }

  public dataURItoBlob(picBytes, imageType) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}



// The function first decodes the base64-encoded data into a byte string using the window.atob() function. It then creates a new ArrayBuffer with the same length as the byte string, and initializes a new Uint8Array with that buffer. The function then iterates over each byte of the byte string and stores the corresponding value in the Uint8Array.

// Finally, the function creates a new Blob object with the Uint8Array as the blob's data and the imageType as the blob's MIME type. The function returns the resulting Blob object.

// Overall, this function is useful for converting image data from a base64-encoded string into a format that can be easily manipulated and processed in a web application.