import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Attributes
  heroes: Hero[];
  loading = false;

  // Constructor
  constructor(private heroService: HeroService) { }

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
        this.heroes = heroes.slice(0, 4);
      });
  }
}
