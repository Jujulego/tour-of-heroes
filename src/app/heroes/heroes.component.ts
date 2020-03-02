import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // Attributes
  heroes: Hero[];
  selectedHero?: Hero;

  // Constructor
  constructor(private heroService: HeroService) {}

  // Lifecycle
  ngOnInit() {
    this.heroes = this.heroService.getHeroes();
  }

  // Handlers
  onSelect(hero: Hero) {
    this.selectedHero = hero;
  }
}
