import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import { AppbarService } from '../../services/appbar.service';

// Component
@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss']
})
export class AppbarComponent {
  // Inputs
  @Input() title: string;

  // Constructor
  constructor(
    public appBar: AppbarService,
    private location: Location,
  ) {}

  // Handlers
  goBack() {
    this.location.back();
  }
}
