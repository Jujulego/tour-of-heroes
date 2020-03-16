import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class AppBarService {
  // Attributes
  back = false;
  small = false;
  opened = false;

  // Constructor
  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(Breakpoints.Medium)
      .subscribe((state) => {
        this.small = state.matches;
      });
  }

  // Methods
  toggle() {
    this.opened = !this.opened;
  }

  close() {
    this.opened = false;
  }

  showBack() {
    this.back = true;
  }

  hideBack() {
    this.back = false;
  }
}
