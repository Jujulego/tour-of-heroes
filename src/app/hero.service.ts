import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

import { Hero } from './hero';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // Attributes
  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Constructor
  constructor(
    private http: HttpClient,
    private messageService: MessageService
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
    this.log('fetching heroes');

    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes()', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    this.log(`fetching hero ${id}`);
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`)
      .pipe(
        tap(_ => this.log(`fetched hero ${id}`)),
        catchError(this.handleError<Hero>(`getHero(id=${id})`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero ${hero.id}`)),
        catchError(this.handleError<any>(`updateHero(hero.id=${hero.id})`))
      );
  }
}
