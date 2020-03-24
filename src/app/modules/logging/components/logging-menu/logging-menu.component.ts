import { Component } from '@angular/core';

import { LoggingService } from '../../services/logging.service';

@Component({
  selector: 'app-logging-menu',
  templateUrl: './logging-menu.component.html',
  styleUrls: ['./logging-menu.component.scss']
})
export class LoggingMenuComponent {
  // Constructor
  constructor(
    public logging: LoggingService
  ) {}
}
