import { Component } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';

import { listItemEnter, listItemLeave } from '../../../../animations';
import { LoggingService } from '../../services/logging.service';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
  animations: [
    trigger('logs', [
      transition(':increment', [
        useAnimation(listItemEnter)
      ]),
      transition(':decrement', [
        useAnimation(listItemLeave)
      ])
    ])
  ]
})
export class LogListComponent {
  // Constructor
  constructor(
    public logging: LoggingService
  ) {}
}
