import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { v1 } from 'uuid';

import { Hero } from '../../data/hero';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  // Methods
  createDb(): { heroes: Hero[] } {
    return {
      heroes: [
        { id: '11', type: 'hero', name: 'Dr Nice' },
        { id: '12', type: 'hero', name: 'Narco' },
        { id: '13', type: 'hero', name: 'Bombasto' },
        { id: '14', type: 'hero', name: 'Celeritas' },
        { id: '15', type: 'hero', name: 'Magneta' },
        { id: '16', type: 'hero', name: 'RubberMan' },
        { id: '17', type: 'hero', name: 'Dynama' },
        { id: '18', type: 'hero', name: 'Dr IQ' },
        { id: '19', type: 'hero', name: 'Magma' },
        { id: '20', type: 'hero', name: 'Tornado' }
      ]
    };
  }

  genId(): string {
    return v1();
  }
}
