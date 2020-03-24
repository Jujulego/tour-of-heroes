import { Component, OnInit } from '@angular/core';

import { HeroService } from '../../services/hero.service';

import { Hero } from '../../../data/hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  // Attributes
  adding = false;
  loading = false;
  heroes: Hero[];

  // Constructor
  constructor(private heroService: HeroService) {}

  // Lifecycle
  ngOnInit() {
    this.getHeroes();
  }

  // Methods
  getHeroes() {
    this.loading = true;
    this.heroService.getHeroes()
      .subscribe(heroes => {
        this.loading = false;
        this.heroes = heroes;
      });
  }

  addHero(name: string) {
    name = name.trim();
    if (!name) { return; }

    this.adding = true;
    this.heroService.addHero({ name })
      .subscribe(hero => {
        this.adding = false;
        this.heroes.push(hero);
      });
  }
}
