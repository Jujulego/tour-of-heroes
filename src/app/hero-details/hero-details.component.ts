import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss']
})
export class HeroDetailsComponent implements OnInit {
  // Attributes
  id: string;
  hero: Hero;
  loading = false;

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
    this.id = this.route.snapshot.paramMap.get('id');

    this.loading = true;
    this.heroService.getHero(this.id)
      .subscribe(hero => {
        this.loading = false;
        this.hero = hero;
      });
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
