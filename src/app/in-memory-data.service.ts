import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { v1 } from 'uuid';

import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  // Methods
  createDb(): { heroes: Hero[] } {
    return {
      heroes: [
        { id: v1(), name: 'Dr Nice' },
        { id: v1(), name: 'Narco' },
        { id: v1(), name: 'Bombasto' },
        { id: v1(), name: 'Celeritas' },
        { id: v1(), name: 'Magneta' },
        { id: v1(), name: 'RubberMan' },
        { id: v1(), name: 'Dynama' },
        { id: v1(), name: 'Dr IQ' },
        { id: v1(), name: 'Magma' },
        { id: v1(), name: 'Tornado' }
      ]
    };
  }

  genId(): string {
    return v1();
  }
}
