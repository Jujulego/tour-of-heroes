import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HeroService } from '../../services/hero.service';

import { Hero } from '../../../data/hero';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  // Attributes
  dirty = false;
  empty = false;
  loading = false;
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
        switchMap((term: string) => {
          this.loading = true;
          return this.heroService.searchHeroes(term);
        }),
        tap((heroes) => {
          this.dirty = true;
          this.empty = heroes.length === 0;
          this.loading = false;
        })
      );
  }

  // Methods
  search(term: string) {
    this.terms.next(term);
  }
}
