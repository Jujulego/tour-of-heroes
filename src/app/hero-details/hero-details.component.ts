import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AppbarService } from '../modules/layout/services/appbar.service';
import { HeroService } from '../hero.service';

import { Hero } from '../../data/hero';
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
  icons = ['/assets/marvel.svg', '/assets/superhero.svg'];

  // tslint:disable-next-line:max-line-length
  base64 = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSItNjAgMCA1MTIgNTEyLjAwMSIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0zNzMuOTg0Mzc1IDM3Ny40NDkyMTloLTM1Ni40ODA0NjlsNzAuNzUtMjU5LjQ1MzEyNWgyMTQuOTg0Mzc1em0wIDAiIGZpbGw9IiNkMGZkZmEiLz48cGF0aCBkPSJtMzU3LjYwOTM3NSA4MC4wMTE3MTktNzUuMDM5MDYzIDg2LjUwMzkwNnY5NS45NjA5MzdsLTg2LjgyNDIxOCAxLjYwOTM3Ni04Ni43NDYwOTQgMS42MDkzNzR2LTk5LjA3ODEyNGwtNzUuMTE3MTg4LTg2LjYwNTQ2OWMtOC4zOTQ1MzEtOS42NzE4NzUtMTIuNTI3MzQzLTIyLjA0Njg3NS0xMS42MTcxODctMzQuODMyMDMxLjkxMDE1Ni0xMi43NzczNDQgNi43MzQzNzUtMjQuNDQxNDA3IDE2LjQxNzk2OS0zMi44NDM3NSA5LjY4MzU5NC04LjM5NDUzMiAyMi4wNTg1OTQtMTIuNTE1NjI2IDM0LjgzMjAzMS0xMS42MTcxODggMTIuNzg1MTU2LjkxMDE1NiAyNC40NDkyMTkgNi43NDYwOTQgMzIuODQzNzUgMTYuNDE3OTY5bDc0LjMwODU5NCA4NS42NTYyNWgzMC4xNTIzNDNsNzQuMzEyNS04NS42NTYyNWM4LjM5MDYyNi05LjY3MTg3NSAyMC4wNTg1OTQtMTUuNTA3ODEzIDMyLjg0Mzc1LTE2LjQxNzk2OSAxMi43NzM0MzgtLjkxMDE1NiAyNS4xNDg0MzggMy4yMjI2NTYgMzQuODMyMDMyIDExLjYxNzE4OCA5LjY4MzU5NCA4LjQwMjM0MyAxNS41MDc4MTIgMjAuMDY2NDA2IDE2LjQxNzk2OCAzMi44NDM3NS45MTAxNTcgMTIuNzg1MTU2LTMuMjIyNjU2IDI1LjE2MDE1Ni0xMS42MTcxODcgMzQuODMyMDMxem0wIDAiIGZpbGw9IiMyNWQ4ZjciLz48cGF0aCBkPSJtMjgyLjQ4ODI4MSAyNTAuNDEwMTU2djIxMC41MTU2MjVjMCAyOC4wNTA3ODEtMjIuODE2NDA2IDUwLjg2NzE4OC01MC44Nzg5MDYgNTAuODY3MTg4LTEzLjk3NjU2MyAwLTI2LjY2MDE1Ni01LjY3MTg3NS0zNS44NjMyODEtMTQuODM1OTM4LTkuMjAzMTI1IDkuMTY0MDYzLTIxLjg5MDYyNSAxNC44MzU5MzgtMzUuODY3MTg4IDE0LjgzNTkzOC0yOC4wNTg1OTQgMC01MC44Nzg5MDYtMjIuODE2NDA3LTUwLjg3ODkwNi01MC44NjcxODh2LTIxMC41MTU2MjV6bTAgMCIgZmlsbD0iIzJmNTg5NyIvPjxwYXRoIGQ9Im0yNTguMjczNDM4IDYyLjUzMTI1YzAgMzQuNDc2NTYyLTI4LjA1MDc4MiA2Mi41MTk1MzEtNjIuNTI3MzQ0IDYyLjUxOTUzMS0zNC40ODA0NjkgMC02Mi41MzEyNS0yOC4wNDI5NjktNjIuNTMxMjUtNjIuNTE5NTMxczI4LjA1NDY4Ny02Mi41MzEyNSA2Mi41MzEyNS02Mi41MzEyNWMzNC40NzY1NjIgMCA2Mi41MjczNDQgMjguMDUwNzgxIDYyLjUyNzM0NCA2Mi41MzEyNXptMCAwIiBmaWxsPSIjZmZkOGE2Ii8+PHBhdGggZD0ibTM3My45ODQzNzUgMzc3LjQ0OTIxOWgtMTc4LjIzODI4MXYtMjU5LjQ1MzEyNWgxMDcuNDkyMTg3em0wIDAiIGZpbGw9IiNiN2RmZjciLz48cGF0aCBkPSJtMzU3LjYwOTM3NSA4MC4wMTE3MTktNzUuMDM5MDYzIDg2LjUwMzkwNnY5NS45NjA5MzdsLTg2LjgyNDIxOCAxLjYwOTM3NnYtMTYxLjI5Mjk2OWgxNS4wNzQyMThsNzQuMzEyNS04NS42NTYyNWM4LjM5MDYyNi05LjY3MTg3NSAyMC4wNTg1OTQtMTUuNTA3ODEzIDMyLjg0Mzc1LTE2LjQxNzk2OSAxMi43NzM0MzgtLjkxMDE1NiAyNS4xNDg0MzggMy4yMjI2NTYgMzQuODMyMDMyIDExLjYxNzE4OCA5LjY4MzU5NCA4LjQwMjM0MyAxNS41MDc4MTIgMjAuMDY2NDA2IDE2LjQxNzk2OCAzMi44NDM3NS45MTAxNTcgMTIuNzg1MTU2LTMuMjIyNjU2IDI1LjE2MDE1Ni0xMS42MTcxODcgMzQuODMyMDMxem0wIDAiIGZpbGw9IiMwMGJmZjAiLz48cGF0aCBkPSJtMTk1Ljc0NjA5NCAxMjUuMDUwNzgxdi0xMjUuMDUwNzgxYzM0LjQ3NjU2MiAwIDYyLjUzMTI1IDI4LjA1MDc4MSA2Mi41MzEyNSA2Mi41MzEyNSAwIDM0LjQ3NjU2Mi0yOC4wNTQ2ODggNjIuNTE5NTMxLTYyLjUzMTI1IDYyLjUxOTUzMXptMCAwIiBmaWxsPSIjZmZjMTcyIi8+PHBhdGggZD0ibTI4Mi40ODgyODEgMjUwLjQxMDE1NnYyMTAuNTE1NjI1YzAgMjguMDUwNzgxLTIyLjgxNjQwNiA1MC44NjcxODgtNTAuODc4OTA2IDUwLjg2NzE4OC0xMy45NzY1NjMgMC0yNi42NjAxNTYtNS42NzE4NzUtMzUuODYzMjgxLTE0LjgzNTkzOHYtMjQ2LjU0Njg3NXptMCAwIiBmaWxsPSIjMTgzMTU4Ii8+PGcgZmlsbD0iIzI1ZDhmNyI+PHBhdGggZD0ibTAgNDAzLjg5ODQzOGgzMC4wMTE3MTl2NTEuMDc4MTI0aC0zMC4wMTE3MTl6bTAgMCIvPjxwYXRoIGQ9Im0wIDQ3Mi4zMTY0MDZoMzAuMDExNzE5djI4LjY3OTY4OGgtMzAuMDExNzE5em0wIDAiLz48cGF0aCBkPSJtNTUuMzU1NDY5IDQwMy44OTg0MzhoMzAuMDExNzE5djYyLjA4MjAzMWgtMzAuMDExNzE5em0wIDAiLz48cGF0aCBkPSJtNTUuMzU1NDY5IDQ4My4zMjQyMTloMzAuMDExNzE5djI4LjY3NTc4MWgtMzAuMDExNzE5em0wIDAiLz48L2c+PHBhdGggZD0ibTM2MS40ODA0NjkgNDAzLjg5ODQzOGgzMC4wMTE3MTl2NTEuMDc4MTI0aC0zMC4wMTE3MTl6bTAgMCIgZmlsbD0iIzAwYmZmMCIvPjxwYXRoIGQ9Im0zNjEuNDgwNDY5IDQ3Mi4zMTY0MDZoMzAuMDExNzE5djI4LjY3OTY4OGgtMzAuMDExNzE5em0wIDAiIGZpbGw9IiMwMGJmZjAiLz48cGF0aCBkPSJtMzA2LjEyNSA0MDMuODk4NDM4aDMwLjAxMTcxOXY2Mi4wODIwMzFoLTMwLjAxMTcxOXptMCAwIiBmaWxsPSIjMDBiZmYwIi8+PHBhdGggZD0ibTMwNi4xMjUgNDgzLjMyNDIxOWgzMC4wMTE3MTl2MjguNjc1NzgxaC0zMC4wMTE3MTl6bTAgMCIgZmlsbD0iIzAwYmZmMCIvPjwvc3ZnPg==';

  foregroundType: GradientType = 'plain';
  foregroundFrom = '#c62828';
  foregroundTo = '#e53935';
  background = '#E0E0E0';

  file?: File = undefined;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private appBar: AppbarService,
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
    this.appBar.hideBack();
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
