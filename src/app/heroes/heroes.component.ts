import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  // Attributes
  heroes: Hero[] = HEROES;
  selectedHero?: Hero;

  // Handlers
  onSelect(hero: Hero) {
    this.selectedHero = hero;
  }
}
