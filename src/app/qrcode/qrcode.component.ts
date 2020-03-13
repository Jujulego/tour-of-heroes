import { Component, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ElementRef, Input, ViewChild } from '@angular/core';

import * as qrcode from 'qrcode';
import { QRCodeErrorCorrectionLevel } from 'qrcode';
import { Square } from './square';

// Types
export type SquareStyle = |
  'circle' | 'diamond' | 'dot' | 'square' | 'star' |
  'edge' | 'round';

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
export class QrcodeComponent implements AfterViewInit, OnChanges {
  // Inputs
  @Input() data: string;
  @Input() version: string;
  @Input() correction: QRCodeErrorCorrectionLevel;

  @Input() width: string;
  @Input() icon: string;

  @Input() background: Color = 'white';
  @Input() foreground: QRColor = 'black';
  @Input() eyeStyle: EyeStyle;
  @Input() squareStyle: SquareStyle;

  // Childs
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  // Attributes
  private size = 10;
  private scale = 100;
  private squares: Square[] = [];

  private img?: HTMLImageElement;
  private ctx: CanvasRenderingContext2D;

  get imageBBox() {
    const w = parseInt(this.width, 10);

    return {
      x: w * 0.3,
      y: w * 0.3,
      width: w * 0.35,
      height: w * 0.35,
    };
  }

  // Lifecycle
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
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
  private buildForeground() {
    if (typeof this.foreground === 'string') {
      return this.foreground;
    }

    // Compute gradient
    const w = parseInt(this.width, 10);
    let grad: CanvasGradient;

    switch (this.foreground.type) {
      case 'radial':
        grad = this.ctx.createRadialGradient(w / 2, w / 2, w / 2 * Math.sqrt(2), w / 2, w / 2, 0);
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

  private eyeAngles(x: number, y: number) {
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

  private framePath(x: number, y: number): string {
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

  private ballPath(x: number, y: number): string {
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

  private squarePath(square: Square): string {
    const s = this.scale;
    const x = square.x * this.scale;
    const y = square.y * this.scale;

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

      case 'square':
      default:
        return `M ${x} ${y} ` +
          `v ${ s} ` +
          `h ${ s} ` +
          `v ${-s} ` +
          `Z`;
    }
  }

  private generate() {
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

  private draw() {
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
    if (this.img) {
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

  private loadIcon() {
    if (!this.icon) {
      this.img = undefined;
      return;
    }

    // Load image
    this.img = new Image();

    this.img.onload = () => {
      if (this.ctx) {
        this.draw();
      }
    };

    this.img.src = this.icon;
  }
}
