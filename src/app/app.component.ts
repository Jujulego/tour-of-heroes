import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AppBarService } from './app-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Attributes
  title = 'Tour of Heroes';

  // Constructor
  constructor(
    public appBar: AppBarService,
    private location: Location,
  ) {}

  // Handlers
  goBack() {
    this.location.back();
  }
}
