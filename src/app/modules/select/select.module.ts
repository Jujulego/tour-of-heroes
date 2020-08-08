import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './components/select/select.component';
import { OptionComponent } from './components/option/option.component';

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
    CommonModule
  ]
})
export class SelectModule { }
