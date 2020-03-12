import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import * as qrcode from 'qrcode';
import { QRCodeErrorCorrectionLevel } from 'qrcode';
import { Square } from './square';

// Types
export type SquareStyle = 'diamond' | 'dot' | 'circle' | 'square' | 'star';

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
export class QrcodeComponent implements OnInit {
  // Inputs
  @Input() data: string;
  @Input() width: string;
  @Input() image: string;
  @Input() squareStyle: SquareStyle;

  @Input() version: string;
  @Input() correction: QRCodeErrorCorrectionLevel;

  // Attributes
  size = 10;
  scale = 100;
  squares: Square[] = [];

  get viewBox(): string {
    return `0,0,${this.width},${this.width}`;
  }

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

  // Methods
  squarePath(square: Square): string {
    const s = this.scale;
    const x = square.x * this.scale;
    const y = square.y * this.scale;

    switch (this.squareStyle) {
      case 'circle':
        return `M ${x + s / 2} ${y} ` +
          `a ${s / 2} ${s / 2} 0 1 0 0 ${s} ` +
          `a ${s / 2} ${s / 2} 0 1 0 0 ${-s} ` +
          `Z`;

      case 'diamond':
        return `M ${x + s / 2} ${y} ` +
          `L ${x} ${y + s / 2} ` +
          `L ${x + s / 2} ${y + s} ` +
          `L ${x + s} ${y + s / 2} ` +
          `Z`;

      case 'dot':
        return `M ${x + s / 2} ${y + s / 4} ` +
          `a ${s / 4} ${s / 4} 0 1 0 0 ${s / 2} ` +
          `a ${s / 4} ${s / 4} 0 1 0 0 ${-s / 2} ` +
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
          `L ${x} ${y + s} ` +
          `L ${x + s} ${y + s} ` +
          `L ${x + s} ${y} ` +
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
          squares.push({ x, y });
        }
      }
    }

    this.size = size;
    this.scale = parseInt(this.width, 10) / size;
    this.squares = squares;
  }
}
