import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import * as qrcode from 'qrcode';
import { QRCodeErrorCorrectionLevel } from 'qrcode';
import { Square } from './square';

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
