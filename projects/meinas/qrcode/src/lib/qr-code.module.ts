import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrCodeComponent } from './components/qr-code/qr-code.component';

// Modules
@NgModule({
  declarations: [
    QrCodeComponent
  ],
  exports: [
    QrCodeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class QrCodeModule { }
