import { Component, AfterViewInit, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SafeResourceUrl } from '@angular/platform-browser';

import { ConnectableObservable, from, merge, Observable, Subject } from 'rxjs';
import { multicast, switchMap } from 'rxjs/operators';

import * as qrcode from 'qrcode';
import { QRCodeErrorCorrectionLevel } from 'qrcode';

import { ImageDataService } from '../image-data.service';

import { Square } from './square';

// Types
export type SquareStyle = |
  'circle' | 'diamond' | 'dot' | 'square' | 'star' |
  'edge' | 'round' | 'zebra' | 'zebra-v';

export type EyeStyle = |
  'circle' | 'square' |
  'edge' | 'edge-int' | 'edge-ext' | 'edge-side' |
  'round' | 'round-int' | 'round-ext' | 'round-side';

type Color = string;

export type GradientType = 'plain' | 'linear-x' | 'linear-y' | 'radial';
interface Gradient {
  type: GradientType;
  from: Color;
  to: Color;
}

export type QRColor = Color | Gradient;

export type DownloadFormat = 'png' | 'svg';
export type RenderMode = 'canvas' | 'svg';

// Utils
function inEyeFrame(x: number, y: number, size: number): boolean {
  return (x < 8 && y < 8) || (x < 8 && y >= size - 8) || (x >= size - 8 && y < 8);
}

// Component
@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit, AfterViewInit, OnChanges {
  // Inputs
  @Input() data: string;
  @Input() version: string;
  @Input() correction: QRCodeErrorCorrectionLevel;

  @Input() width: string;
  @Input() icon: string | File;

  @Input() background: Color = 'white';
  @Input() foreground: QRColor = 'black';
  @Input() eyeStyle: EyeStyle;
  @Input() squareStyle: SquareStyle;
  @Input() renderMode: RenderMode = 'svg';

  // Childs
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('svg', { static: true })
  svg: ElementRef<SVGElement>;

  // Attributes
  size = 10;
  scale = 100;
  squares: Square[] = [];

  private img?: HTMLImageElement; // <img> element used to render icon inside canvas

  private iconURL$ = new Subject<string>();       // icon url from @Input icon attribute
  private iconFile$ = new Subject<Blob>();        // icon file object from @Input icon attribute
  private iconData$: ConnectableObservable<Blob>; // icon blob data (file from iconFile$ or downloaded from iconURL$)
  icon$: Observable<SafeResourceUrl>;             // base64 encoded icon => svg

  private ctx: CanvasRenderingContext2D;

  get fg(): Gradient { // Simplify foreground structure for template
    if (typeof this.foreground === 'string') {
      return {
        type: 'plain',
        from: this.foreground,
        to: this.foreground
      };
    } else {
      return this.foreground;
    }
  }

  get imageBBox() { // Compute image size and coordinates
    const s = this.scale;
    const w = Math.floor(this.size * 0.35);

    return {
      x: s * (this.size - w) / 2,
      y: s * (this.size - w) / 2,
      width: s * w,
      height: s * w,
    };
  }

  // Constructor
  constructor(
    private http: HttpClient,
    private imageData: ImageDataService
  ) {}

  // Lifecycle
  ngOnInit(): void {
    this.setupIconPipeline();
    this.loadIcon();
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.icon) {
      this.loadIcon();
    }

    if (changes.data || changes.version || changes.correction) {
      this.generate();
    } else if (changes.width || changes.background || changes.foreground || changes.eyeStyle || changes.squareStyle) {
      this.draw();
    }
  }

  // Methods
  private buildForeground() { // Build foreground value for canvas context
    if (typeof this.foreground === 'string') {
      return this.foreground;
    }

    // Compute gradient
    const w = parseInt(this.width, 10);
    let grad: CanvasGradient;

    switch (this.foreground.type) {
      case 'radial':
        grad = this.ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2 * Math.sqrt(2));
        break;

      case 'linear-x':
        grad = this.ctx.createLinearGradient(0, 0, w, 0);
        break;

      case 'linear-y':
        grad = this.ctx.createLinearGradient(0, 0, 0, w);
        break;

      case 'plain':
      default:
        return this.foreground.from;
    }

    grad.addColorStop(0, this.foreground.from);
    grad.addColorStop(1, this.foreground.to);

    return grad;
  }

  private eyeAngles(x: number, y: number) { // Computes which eye angles SHOULD NOT be customized
    const mode = /^[a-z]+-([a-z]+)$/i.test(this.eyeStyle) ? RegExp.$1 : '';
    if (mode === '') {
      return { tl: false, bl: false, br: false, tr: false };
    }

    const tl = x === 0 && y === 0;
    const bl = !tl && x === 0;
    const tr = !tl && y === 0;

    return {
      tl: (mode === 'ext') ? !tl : tl,
      bl: (mode === 'ext') ? !bl : (bl || (mode === 'side' && tr)),
      br: (mode === 'ext') || ((mode === 'side') && tl),
      tr: (mode === 'ext') ? !tr : (tr || (mode === 'side' && bl)),
    };
  }

  framePath(x: number, y: number): string { // Computes a svg path for the eye's frames
    const s = this.scale;
    x *= this.scale;
    y *= this.scale;

    const { tl, bl, br, tr } = this.eyeAngles(x, y);

    switch (this.eyeStyle) {
      case 'circle':
        return `M ${x + s * 3.5} ${y + s * .5} ` +
          `a ${s * 3} ${s * 3} 0 1 0 0 ${ s * 6} ` +
          `a ${s * 3} ${s * 3} 0 1 0 0 ${-s * 6} ` +
          `Z`;

      case 'edge':
      case 'edge-int':
      case 'edge-side':
      case 'edge-ext':
        return `M ${x + s * 2} ${y + s * .5} ` +
          (tl ? `h ${-s * 1.5} v ${ s * 1.5} ` : `l ${-s * 1.5} ${ s * 1.5} `) +
          `v ${ s * 3} ` +
          (bl ? `v ${ s * 1.5} h ${ s * 1.5} ` : `l ${ s * 1.5} ${ s * 1.5} `) +
          `h ${ s * 3} ` +
          (br ? `h ${ s * 1.5} v ${-s * 1.5} ` : `l ${ s * 1.5} ${-s * 1.5} `) +
          `v ${-s * 3} ` +
          (tr ? `v ${-s * 1.5} h ${-s * 1.5} ` : `l ${-s * 1.5} ${-s * 1.5} `) +
          `Z`;

      case 'round':
      case 'round-int':
      case 'round-side':
      case 'round-ext':
        return `M ${x + s * 2} ${y + s * .5} ` +
          (tl ? `h ${-s * 1.5} v ${ s * 1.5} ` : `a ${ s * 1.5} ${s * 1.5} 0 0 0 ${-s * 1.5} ${ s * 1.5} `) +
          `v ${ s * 3} ` +
          (bl ? `v ${ s * 1.5} h ${ s * 1.5} ` : `a ${ s * 1.5} ${s * 1.5} 0 0 0 ${ s * 1.5} ${ s * 1.5} `) +
          `h ${ s * 3} ` +
          (br ? `h ${ s * 1.5} v ${-s * 1.5} ` : `a ${ s * 1.5} ${s * 1.5} 0 0 0 ${ s * 1.5} ${-s * 1.5} `) +
          `v ${-s * 3} ` +
          (tr ? `v ${-s * 1.5} h ${-s * 1.5} ` : `a ${ s * 1.5} ${s * 1.5} 0 0 0 ${-s * 1.5} ${-s * 1.5} `) +
          `Z`;

      case 'square':
      default:
        return `M ${x + s * .5} ${y + s * .5} ` +
          `v ${ s * 6} ` +
          `h ${ s * 6} ` +
          `v ${-s * 6} ` +
          `Z`;
    }
  }

  ballPath(x: number, y: number): string { // Computes svg path for eye's balls
    const s = this.scale;
    x *= this.scale;
    y *= this.scale;

    const { tl, bl, br, tr } = this.eyeAngles(x, y);

    switch (this.eyeStyle) {
      case 'circle':
        return `M ${x + s * 3.5} ${y + s * 2} ` +
          `a ${s * 1.5} ${s * 1.5} 0 1 0 0 ${ s * 3} ` +
          `a ${s * 1.5} ${s * 1.5} 0 1 0 0 ${-s * 3} ` +
          `Z`;

      case 'edge':
      case 'edge-int':
      case 'edge-side':
      case 'edge-ext':
        return `M ${x + s * 3} ${y + s * 2} ` +
          (tl ? `h ${-s} v ${ s} ` : `l ${-s} ${ s} `) +
          `v ${ s} ` +
          (bl ? `v ${ s} h ${ s} ` : `l ${ s} ${ s} `) +
          `h ${ s} ` +
          (br ? `h ${ s} v ${-s} ` : `l ${ s} ${-s} `) +
          `v ${-s} ` +
          (tr ? `v ${-s} h ${-s} ` : `l ${-s} ${-s} `) +
          `Z`;

      case 'round':
      case 'round-int':
      case 'round-side':
      case 'round-ext':
        return `M ${x + s * 3} ${y + s * 2} ` +
          (tl ? `h ${-s} v ${ s} ` : `a ${ s} ${s} 0 0 0 ${-s} ${ s} `) +
          `v ${ s} ` +
          (bl ? `v ${ s} h ${ s} ` : `a ${ s} ${s} 0 0 0 ${ s} ${ s} `) +
          `h ${ s} ` +
          (br ? `h ${ s} v ${-s} ` : `a ${ s} ${s} 0 0 0 ${ s} ${-s} `) +
          `v ${-s} ` +
          (tr ? `v ${-s} h ${-s} ` : `a ${ s} ${s} 0 0 0 ${-s} ${-s} `) +
          `Z`;

      case 'square':
      default:
        return `M ${x + s * 2} ${y + s * 2} ` +
          `v ${ s * 3} ` +
          `h ${ s * 3} ` +
          `v ${-s * 3} ` +
          `Z`;
    }
  }

  squarePath(square: Square): string { // Computes svg path for one black square of the QRCode
    const s = this.scale;
    const x = square.x * this.scale;
    const y = square.y * this.scale;

    // Computes which square angle SHOULD be customized
    const tl = !square.top && !square.left;
    const tr = !square.top && !square.right;
    const bl = !square.bottom && !square.left;
    const br = !square.bottom && !square.right;

    switch (this.squareStyle) {
      case 'circle':
        return `M ${x + s / 2} ${y} ` +
          `a ${s / 2} ${s / 2} 0 1 0 0 ${s} ` +
          `a ${s / 2} ${s / 2} 0 1 0 0 ${-s} ` +
          `Z`;

      case 'diamond':
        return `M ${x + s / 2} ${y} ` +
          `l ${-s / 2} ${ s / 2} ` +
          `l ${ s / 2} ${ s / 2} ` +
          `l ${ s / 2} ${-s / 2} ` +
          `Z`;

      case 'dot':
        return `M ${x + s / 2} ${y + s / 4} ` +
          `a ${s / 4} ${s / 4} 0 1 0 0 ${ s / 2} ` +
          `a ${s / 4} ${s / 4} 0 1 0 0 ${-s / 2} ` +
          `Z`;

      case 'edge':
        return `M ${x + s / 2} ${y} ` +
          (tl ? `l ${-s / 2} ${ s / 2} ` : `h ${-s / 2} v ${ s / 2}`) +
          (bl ? `l ${ s / 2} ${ s / 2} ` : `v ${ s / 2} h ${ s / 2}`) +
          (br ? `l ${ s / 2} ${-s / 2} ` : `h ${ s / 2} v ${-s / 2}`) +
          (tr ? `l ${-s / 2} ${-s / 2} ` : `v ${-s / 2} h ${-s / 2}`) +
          `Z`;

      case 'round':
        return `M ${x + s / 2} ${y} ` +
          (tl ? `a ${s / 2} ${s / 2} 0 0 0 ${-s / 2} ${ s / 2} ` : `h ${-s / 2} v ${ s / 2}`) +
          (bl ? `a ${s / 2} ${s / 2} 0 0 0 ${ s / 2} ${ s / 2} ` : `v ${ s / 2} h ${ s / 2}`) +
          (br ? `a ${s / 2} ${s / 2} 0 0 0 ${ s / 2} ${-s / 2} ` : `h ${ s / 2} v ${-s / 2}`) +
          (tr ? `a ${s / 2} ${s / 2} 0 0 0 ${-s / 2} ${-s / 2} ` : `v ${-s / 2} h ${-s / 2}`) +
          `Z`;

      case 'star':
        return `M ${x + s / 2} ${y} ` +
          `Q ${x + s * .4} ${y + s * .4} ${x} ${y + s / 2} ` +
          `Q ${x + s * .4} ${y + s * .6} ${x + s / 2} ${y + s} ` +
          `Q ${x + s * .6} ${y + s * .6} ${x + s} ${y + s / 2} ` +
          `Q ${x + s * .6} ${y + s * .4} ${x + s / 2} ${y} ` +
          `Z`;

      case 'zebra':
        return `M ${x + s / 2} ${y + s * .1} ` +
          (square.left  ? `h ${-s / 2} v ${ s * .8} h ${ s / 2}` : `a ${s * .1} ${s * .1} 0 1 0 0 ${ s * .8} `) +
          (square.right ? `h ${ s / 2} v ${-s * .8} h ${-s / 2}` : `a ${s * .1} ${s * .1} 0 1 0 0 ${-s * .8} `) +
          `Z`;

      case 'zebra-v':
        return `M ${x + s * .1} ${y + s / 2} ` +
          (square.bottom ? `v ${ s / 2} h ${ s * .8} v ${-s / 2}` : `a ${s * .1} ${s * .1} 0 1 0 ${ s * .8} 0 `) +
          (square.top    ? `v ${-s / 2} h ${-s * .8} v ${ s / 2}` : `a ${s * .1} ${s * .1} 0 1 0 ${-s * .8} 0 `) +
          `Z`;

      case 'square':
      default:
        return `M ${x} ${y} ` +
          `v ${ s} ` +
          `h ${ s} ` +
          `v ${-s} ` +
          `Z`;
    }
  }

  private generate() { // Computes the QRCode from the given data
    // If no data ...
    if (!this.data) {
      this.draw();
      return;
    }

    // Generate QR code
    const version = parseInt(this.version, 10) || 0;

    const code = qrcode.create(this.data,
      {
        version: Math.max(version, 4),
        errorCorrectionLevel: this.correction,
      }
    );

    // Build result
    const { data, size } = code.modules;
    const squares: Square[] = [];

    for (let x = 0; x < size; ++x) {
      for (let y = 0; y < size; ++y) {
        if (inEyeFrame(x, y, size)) { continue; }

        if (data[x * size + y]) {
          squares.push({
            x, y,
            top: (y > 0) && !!data[x * size + (y - 1)],
            left: (x > 0) && !!data[(x - 1) * size + y],
            right: (x < size - 1) && !!data[(x + 1) * size + y],
            bottom: (y < size - 1) && !!data[x * size + (y + 1)],
          });
        }
      }
    }

    this.size = size;
    this.scale = parseInt(this.width, 10) / size;
    this.squares = squares;

    if (this.ctx) {
      this.draw();
    }
  }

  private draw() { // Draws the QRCode inside the canvas
    // Get context
    if (!this.canvas) { return; }
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    // Measures
    const width = parseInt(this.width, 10);
    const size = this.size;
    const s = this.scale;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, width);

    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, width, width);

    // Style
    const foreground = this.buildForeground();

    // Draw eyes
    this.ctx.fillStyle = foreground;
    this.ctx.strokeStyle = foreground;
    this.ctx.lineWidth = s;

    // - top left
    this.ctx.stroke(new Path2D(this.framePath(0, 0)));
    this.ctx.fill(new Path2D(this.ballPath(0, 0)));

    // - bottom left
    this.ctx.stroke(new Path2D(this.framePath(0, size - 7)));
    this.ctx.fill(new Path2D(this.ballPath(0, size - 7)));

    // - top right
    this.ctx.stroke(new Path2D(this.framePath(size - 7, 0)));
    this.ctx.fill(new Path2D(this.ballPath(size - 7, 0)));

    // No data => no squares
    if (!this.data) {
      return;
    }

    // Draw squares
    this.ctx.fillStyle = foreground;

    this.squares.forEach(square => {
      this.ctx.fill(new Path2D(this.squarePath(square)));
    });

    // Add icon
    if (this.img && this.icon) {
      this.ctx.fillStyle = this.background;

      this.ctx.fillRect(
        this.imageBBox.x, this.imageBBox.y,
        this.imageBBox.width, this.imageBBox.height
      );

      this.ctx.drawImage(this.img,
        this.imageBBox.x, this.imageBBox.y,
        this.imageBBox.width, this.imageBBox.height
      );
    }
  }

  private setupIconPipeline() {
    // Download Icon
    this.iconData$ = merge(
      this.iconFile$,
      this.iconURL$
        .pipe(
          switchMap((url: string) => this.http.get(url, { responseType: 'blob' }))
        )
    ).pipe(multicast(new Subject())) as ConnectableObservable<Blob>;

    // Create img element for canvas
    this.img = new Image();

    this.img.onload = () => {
      if (this.ctx) {
        this.draw();
      }
    };

    this.iconData$.subscribe((blob) => {
      if (this.img.src) {
        URL.revokeObjectURL(this.img.src);
      }

      this.img.src = URL.createObjectURL(blob);
    });

    // Convert data for svg
    this.icon$ = this.iconData$
      .pipe(
        switchMap((data: Blob) => from(this.imageData.blob2url(data)))
      );

    this.iconData$.connect();
  }

  private loadIcon() {
    if (!this.icon) { return; }
    if (typeof this.icon === 'string') {
      this.iconURL$.next(this.icon);
    } else {
      this.iconFile$.next(this.icon);
    }
  }

  downloadHref(format: DownloadFormat): SafeResourceUrl {
    if (!this.canvas || !this.svg || !this.data) {
      return '';
    }

    // Create png data
    switch (format) {
      case 'svg':
        return this.imageData.svg2url(this.svg);

      case 'png':
      default:
        return this.imageData.canvas2url(this.canvas);
    }
  }
}
