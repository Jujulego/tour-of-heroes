import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

// Service
@Injectable()
export class SelectService {
  // Attributes
  private subject = new ReplaySubject<any>(1);

  // Methods
  select(value: any) {
    this.subject.next(value);
  }

  // Properties
  get value(): Observable<any> {
    return this.subject.asObservable();
  }
}
