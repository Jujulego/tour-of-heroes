import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  // Attributes
  heroes: Hero[];

  // Constructor
  constructor(private heroService: HeroService) {}

  // Lifecycle
  ngOnInit() {
    this.getHeroes();
  }

  // Methods
  getHeroes() {
    this.heroService.getHeroes().subscribe(
      heroes => this.heroes = heroes
    );
  }

  addHero(name: string) {
    name = name.trim();

    if (!name) { return; }
    this.heroService.addHero({ name })
      .subscribe(hero => this.heroes.push(hero));
  }

  deleteHero(hero: Hero) {
    this.heroes = this.heroes.filter(h => h.id !== hero.id);
    this.heroService.deleteHero(hero).subscribe();
  }
}
