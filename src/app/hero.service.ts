import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { LoggingService } from './modules/logging/services/logging.service';

import { Hero } from '../data/hero';
import { catchError, tap } from 'rxjs/operators';

import { environment as env } from '../environments/environment';

const BASE_URL = env.memoryApi ? 'api' : env.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // Attributes
  private heroesUrl = `${BASE_URL}/heroes`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Constructor
  constructor(
    private http: HttpClient,
    private messageService: LoggingService
  ) {}

  // Methods
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      // Logging
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Empty result
      return of(result);
    };
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes()', []))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();
    if (!term) { return of([]); }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`, this.httpOptions)
      .pipe(
        tap(results => this.log(
          results.length ? `found ${results.length} heroes matching ${term}` : `no heroes matching ${term}`)
        ),
        catchError(this.handleError<Hero[]>('getHeroes()', []))
      );
  }

  getHero(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched hero ${id.slice(0, 8)}`)),
        catchError(this.handleError<Hero>(`getHero(id=${id})`))
      );
  }

  addHero(hero: Pick<Hero, 'name'>): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(newHero => this.log(`created hero ${newHero.id.slice(0, 8)}`)),
        catchError(this.handleError<Hero>(`addHero(hero.name=${hero.name})`))
      );
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero ${hero.id.slice(0, 8)}`)),
        catchError(this.handleError<Hero>(`updateHero(hero.id=${hero.id})`))
      );
  }

  deleteHero(hero: Hero): Observable<any> {
    return this.http.delete(`${this.heroesUrl}/${hero.id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero ${hero.id.slice(0, 8)}`)),
        catchError(this.handleError<any>(`deleteHero(hero.id=${hero.id})`))
      );
  }
}
