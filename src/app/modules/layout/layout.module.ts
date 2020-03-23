import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppbarComponent } from './components/appbar/appbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DrawerComponent } from './components/drawer/drawer.component';

// Module
@NgModule({
  declarations: [
    AppbarComponent,
    DrawerComponent
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
