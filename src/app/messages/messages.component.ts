import { Component } from '@angular/core';
import { animate, style, transition, trigger, useAnimation } from '@angular/animations';

import { LoggingService } from '../modules/logging/services/logging.service';
import { listItemEnter, listItemLeave } from '../animations';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    trigger('messages', [
      transition(':increment', [
        useAnimation(listItemEnter)
      ]),
      transition(':decrement', [
        useAnimation(listItemLeave)
      ])
    ]),
    trigger('deleteIcon', [
      // Transitions
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms', style({ opacity: 0 }))
      ]),
    ])
  ]
})
export class MessagesComponent {
  // Attributes
  deployed = false;

  // Constructor
  constructor(public messageService: LoggingService) {}

  // Handlers
  toggle() {
    this.deployed = !this.deployed;
  }
}
