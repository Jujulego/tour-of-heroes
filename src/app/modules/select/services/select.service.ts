import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Types
export interface Option {
  value: any;
}

// Service
@Injectable()
export class SelectService {
  // Attributes
  multiple = false;
  private selectedIds: Set<number>;
  private subjectIds: BehaviorSubject<number[]>;
  private options: Option[] = [];

  $selectedIds: Observable<number[]>;
  $selectedValues: Observable<any[]>;

  // Constructor
  constructor() {
    this.init();
  }

  // Methods
  private init() {
    this.selectedIds = new Set();
    this.subjectIds = new BehaviorSubject<number[]>([]);
    this.$selectedIds = this.subjectIds.asObservable();

    this.$selectedValues = this.$selectedIds
      .pipe(
        map(ids => ids.map(id => this.options[id]?.value).filter(v => v))
      );
  }

  register(value: any): number {
    const id = this.options.length;
    this.options.push({ value });

    return id;
  }

  select(id: number) {
    if (!this.multiple) {
      this.selectedIds.clear();
    }

    this.selectedIds.add(id);
    this.subjectIds.next(Array.from(this.selectedIds));
  }

  unselect(id: number) {
    this.selectedIds.delete(id);
    this.subjectIds.next(Array.from(this.selectedIds));
  }

  toggle(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      if (!this.multiple) {
        this.selectedIds.clear();
      }

      this.selectedIds.add(id);
    }

    this.subjectIds.next(Array.from(this.selectedIds));
  }
}
