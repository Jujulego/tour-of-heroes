import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './components/loader/loader.component';
import { LoaderOverlayComponent } from './components/loader-overlay/loader-overlay.component';

// Modules
@NgModule({
  declarations: [
    LoaderComponent,
    LoaderOverlayComponent
  ],
  exports: [
    LoaderComponent,
    LoaderOverlayComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LoaderModule { }
