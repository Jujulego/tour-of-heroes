import { Directive, HostListener } from '@angular/core';

import { AppbarService } from '../services/appbar.service';

// Directive
@Directive({
  selector: '[app-close-appbar]'
})
export class CloseAppbarDirective {
  // Constructor
  constructor(
    private appbar: AppbarService
  ) {}

  // Events
  @HostListener('click') onClick() {
    this.appbar.close();
  }
}
