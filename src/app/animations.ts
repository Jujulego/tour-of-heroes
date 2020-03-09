import { animation, animate, query, stagger, style } from '@angular/animations';

// Animations
export const listItemEnter = animation([
  query(':enter', [
    style({
      transform: 'translateX(-100%)',
      opacity: 0
    }),
    stagger(50, [
      animate('250ms ease-out')
    ])
  ], { optional: true })
]);

export const listItemLeave = animation([
  query(':leave', [
    stagger(50, [
      animate('250ms ease-in', style({
        transform: 'translateX(100%)',
        opacity: 0
      }))
    ])
  ], { optional: true })
]);
