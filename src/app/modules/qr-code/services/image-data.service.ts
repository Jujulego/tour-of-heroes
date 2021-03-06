import { ElementRef, Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  // Constructor
  constructor(
    private sanitizer: DomSanitizer
  ) {}

  // Methods
  blob2url(blob: Blob): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });
  }

  svg2url(svg: ElementRef<SVGElement>): SafeResourceUrl {
    const serializer = new XMLSerializer();
    const data = btoa(serializer.serializeToString(svg.nativeElement));

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/svg+xml;base64,${data}`
    );
  }

  canvas2url(canvas: ElementRef<HTMLCanvasElement>, type?: string, quality?: number): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      canvas.nativeElement.toDataURL(type, quality)
    );
  }
}
