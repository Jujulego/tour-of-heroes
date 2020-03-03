import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css']
})
export class HeroDetailsComponent implements OnInit {
  // Attributes
  hero: Hero;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  // Lifecycle
  ngOnInit(): void {
    this.getHero();
  }

  // Methods
  getHero() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  save() {
    this.heroService.updateHero(this.hero)
      .subscribe(_ => this.goBack());
  }

  delete() {
    this.heroService.deleteHero(this.hero)
      .subscribe(_ => this.goBack());
  }

  goBack() {
    this.location.back();
  }
}
