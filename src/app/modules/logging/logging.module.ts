import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogListComponent } from './components/log-list/log-list.component';
import { MatListModule } from '@angular/material/list';
import { LoggingMenuComponent } from './components/logging-menu/logging-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    LogListComponent,
    LoggingMenuComponent
  ],
  exports: [
    LogListComponent,
    LoggingMenuComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LoggingModule { }
