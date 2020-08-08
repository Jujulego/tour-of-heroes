import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './components/select/select.component';
import { OptionComponent } from './components/option/option.component';
import { MatIconModule } from '@angular/material/icon';

// Module
@NgModule({
  declarations: [
    SelectComponent,
    OptionComponent
  ],
  exports: [
    SelectComponent,
    OptionComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class SelectModule { }
