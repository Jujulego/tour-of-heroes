import { Component } from '@angular/core';

import { MessageService } from '../message.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    trigger('messages', [
      transition(':increment', [
        query(':enter', [
          style({
            transform: 'translateX(-100%)',
            opacity: 0
          }),
          stagger(50, [
            animate('250ms ease-out')
          ])
        ])
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('250ms ease-in', style({
              transform: 'translateX(100%)',
              opacity: 0
            }))
          ])
        ])
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
  constructor(public messageService: MessageService) {}

  // Handlers
  toggle() {
    this.deployed = !this.deployed;
  }
}
