import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogListComponent } from './components/log-list/log-list.component';
import { MatListModule } from '@angular/material/list';



@NgModule({
  declarations: [LogListComponent],
  exports: [
    LogListComponent
  ],
  imports: [
    CommonModule,
    MatListModule
  ]
})
export class LoggingModule { }
