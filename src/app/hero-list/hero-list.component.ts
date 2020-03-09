import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';

import { HeroService } from '../hero.service';

import { listItemEnter, listItemLeave } from '../animations';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  animations: [
    trigger('heroes', [
      transition(':increment', [
        useAnimation(listItemEnter)
      ]),
      transition(':decrement', [
        useAnimation(listItemLeave)
      ])
    ])
  ]
})
export class HeroListComponent {
  // Attributes
  private _heroes: Hero[] = []; // tslint:disable-line:variable-name

  // Inputs
  @Input() canDelete = false;
  @Input() set heroes(heroes: Hero[]) {
    this._heroes = heroes.map(hero => {
      return this._heroes.find(h => h.id === hero.id) || hero;
    });
  }

  get heroes(): Hero [] { return this._heroes; }

  // Constructor
  constructor(
    private heroService: HeroService
  ) {}

  // Methods
  deleteHero(event: MouseEvent, hero: Hero) {
    event.preventDefault();

    this.heroes = this.heroes.filter(h => h.id !== hero.id);
    this.heroService.deleteHero(hero).subscribe();
  }
}
