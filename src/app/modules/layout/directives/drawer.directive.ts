import { Directive, Host, HostListener, OnInit } from '@angular/core';

import { MatDrawer } from '@angular/material/sidenav';

import { AppbarService, AppbarState } from '../services/appbar.service';

// Directive
@Directive({
  selector: '[app-drawer]'
})
export class DrawerDirective implements OnInit {
  // Constructor
  constructor(
    private appbar: AppbarService,
    @Host() private host: MatDrawer
  ) {}

  // Lifecycle
  ngOnInit(): void {
    // Init
    this.updateHost(this.appbar);

    // Subscribe
    this.appbar.state$
      .subscribe(state => this.updateHost(state));
  }

  // Methods
  private updateHost(state: AppbarState) {
    this.host.mode = state.small ? 'over' : 'side';
    this.host.opened = !state.small || state.opened;
  }

  // Events
  @HostListener('closed') onClose() {
    this.appbar.close();
  }
}
