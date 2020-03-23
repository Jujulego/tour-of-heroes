import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppbarComponent } from './components/appbar/appbar.component';
import { CloseAppbarDirective } from './directives/close-appbar.directive';
import { DrawerDirective } from './directives/drawer.directive';
import { LayoutComponent } from './components/layout/layout.component';

// Module
@NgModule({
  declarations: [
    AppbarComponent,
    CloseAppbarDirective,
    DrawerDirective,
    LayoutComponent
  ],
  exports: [
    AppbarComponent,
    CloseAppbarDirective,
    DrawerDirective,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class LayoutModule { }
