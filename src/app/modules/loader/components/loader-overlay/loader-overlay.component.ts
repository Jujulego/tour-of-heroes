import { Component, HostBinding } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-loader-overlay',
  templateUrl: './loader-overlay.component.html',
  styleUrls: ['./loader-overlay.component.scss'],
  animations: [
    trigger('overlay', [
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
export class LoaderOverlayComponent {
  @HostBinding('@overlay')
  private animate = true;
}
