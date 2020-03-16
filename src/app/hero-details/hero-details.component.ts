import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AppBarService } from '../app-bar.service';
import { HeroService } from '../hero.service';

import { Hero } from '../hero';
import { GradientType } from '../qrcode/qrcode.component';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss']
})
export class HeroDetailsComponent implements OnInit, OnDestroy {
  // Attributes
  id: string;
  hero: Hero;
  loading = false;

  icon = '/assets/marvel.svg';
  icons = ['/assets/marvel.svg', '/assets/marvel.png'];
  foregroundType: GradientType = 'plain';
  foregroundFrom = '#1A237E';
  foregroundTo = '#42A5F5';
  background = '#C5CAE9';

  file?: File = undefined;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private appBar: AppBarService,
    private heroService: HeroService,
    private location: Location
  ) {
    this.appBar.showBack();
  }

  // Lifecycle
  ngOnInit(): void {
    this.getHero();
  }

  ngOnDestroy(): void {
    this.appBar.back = false;
  }

  // Methods
  selectIcon(icon: string) {
    this.file = undefined;
    this.icon = icon;
  }

  fileChange(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

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
