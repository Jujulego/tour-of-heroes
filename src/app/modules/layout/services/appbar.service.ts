import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

// Interface
export interface AppbarState {
  back: boolean;
  small: boolean;
  opened: boolean;
}

// Service
@Injectable({
  providedIn: 'root'
})
export class AppbarService implements AppbarState {
  // Attributes
  back = false;
  small = false;
  opened = false;

  state$ = new Subject<AppbarState>();

  // Constructor
  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(Breakpoints.Medium)
      .subscribe((state) => {
        this.small = state.matches;
        this.emitState();
      });
  }

  // Methods
  private emitState() {
    this.state$.next({
      back: this.back,
      small: this.small,
      opened: this.opened
    });
  }

  toggle() {
    this.opened = !this.opened;
    this.emitState();
  }

  close() {
    this.opened = false;
    this.emitState();
  }

  showBack() {
    this.back = true;
    this.emitState();
  }

  hideBack() {
    this.back = false;
    this.emitState();
  }
}
