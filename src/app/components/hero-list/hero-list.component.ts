import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';

import { HeroService } from '../../services/hero.service';

import { listItemEnter, listItemLeave } from '../../animations';
import { Hero } from '../../../data/hero';

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
    if (!heroes) {
      this._heroes = [];
    } else {
      for (let i = 0; i < heroes.length; ++i) {
        const hero = heroes[i];
        heroes[i] = this._heroes.find(h => h.id === hero.id) || hero;
      }

      this._heroes = heroes;
    }
  }

  get heroes(): Hero [] { return this._heroes; }

  // Constructor
  constructor(
    private heroService: HeroService
  ) {}

  // Methods
  deleteHero(event: MouseEvent, hero: Hero) {
    event.preventDefault();
    event.stopPropagation();

    const index = this.heroes.findIndex(h => h.id === hero.id);
    this.heroes.splice(index, 1);

    this.heroService.deleteHero(hero).subscribe();
  }
}
