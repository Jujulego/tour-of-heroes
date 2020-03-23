import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppbarComponent } from './component/appbar/appbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Module
@NgModule({
  declarations: [
    AppbarComponent
  ],
  exports: [
    AppbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class LayoutModule { }
