import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Attributes
  heroes: Hero[];

  // Constructor
  constructor(private heroService: HeroService) { }

  // Lifecycle
  ngOnInit() {
    this.getHeroes();
  }

  // Methods
  getHeroes() {
    this.heroService.getHeroes().subscribe(
      heroes => this.heroes = heroes.slice(1, 5)
    );
  }
}
