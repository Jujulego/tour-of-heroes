import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ElementRef, Input, ViewChild } from '@angular/core';

import * as qrcode from 'qrcode';
import { QRCodeErrorCorrectionLevel } from 'qrcode';
import { Square } from './square';

// Types
export type SquareStyle = |
  'circle' | 'diamond' | 'dot' | 'square' | 'star' |
  'pointed' | 'rounded';

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
export class QrcodeComponent implements OnInit, AfterViewInit {
  // Inputs
  @Input() data: string;
  @Input() width: string;
  @Input() icon: string;
  @Input() squareStyle: SquareStyle = 'diamond';

  @Input() version: string;
  @Input() correction: QRCodeErrorCorrectionLevel;

  // Childs
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  // Attributes
  private size = 10;
  private scale = 100;
  private squares: Square[] = [];

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
  ngOnInit(): void {
    this.generate();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  // Methods
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

      case 'pointed':
        return `M ${x + s / 2} ${y} ` +
          (tl ? `l ${-s / 2} ${ s / 2} ` : `h ${-s / 2} v ${ s / 2}`) +
          (bl ? `l ${ s / 2} ${ s / 2} ` : `v ${ s / 2} h ${ s / 2}`) +
          (br ? `l ${ s / 2} ${-s / 2} ` : `h ${ s / 2} v ${-s / 2}`) +
          (tr ? `l ${-s / 2} ${-s / 2} ` : `v ${-s / 2} h ${-s / 2}`) +
          `Z`;

      case 'rounded':
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
    const version = parseInt(this.version, 10) || 0;

    // Generate QR code
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

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, width, width);

    // Draw eyes
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = s;

    // - top left
    this.ctx.strokeRect(0.5 * s, 0.5 * s, 6 * s, 6 * s);
    this.ctx.fillRect(2 * s, 2 * s, 3 * s, 3 * s);

    // - bottom left
    this.ctx.strokeRect(0.5 * s, (size - 6.5) * s, 6 * s, 6 * s);
    this.ctx.fillRect(2 * s, (size - 5) * s, 3 * s, 3 * s);

    // - top right
    this.ctx.strokeRect((size - 6.5) * s, 0.5 * s, 6 * s, 6 * s);
    this.ctx.fillRect((size - 5) * s, 2 * s, 3 * s, 3 * s);

    // Draw squares
    this.ctx.fillStyle = 'black';

    this.squares.forEach(square => {
      this.ctx.fill(new Path2D(this.squarePath(square)));
    });

    // Add icon
    if (this.icon) {
      const img = new Image();

      img.onload = () => {
        console.log('image ! ', this.ctx, this.imageBBox);
        this.ctx.drawImage(img,
          this.imageBBox.x, this.imageBBox.y,
          this.imageBBox.width, this.imageBBox.height
        );
      };

      img.src = this.icon;
    }
  }
}
