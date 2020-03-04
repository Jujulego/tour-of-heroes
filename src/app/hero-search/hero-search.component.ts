import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  // Attributes
  heroes$: Observable<Hero[]>;
  private terms = new Subject<string>();

  // Constructor
  constructor(
    private heroService: HeroService
  ) {}

  // Lifecycle
  ngOnInit(): void {
    this.heroes$ = this.terms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.heroService.searchHeroes(term))
      );
  }

  // Methods
  search(term: string) {
    this.terms.next(term);
  }
}
