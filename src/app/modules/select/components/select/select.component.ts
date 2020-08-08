import { Component, Input, Self } from '@angular/core';

import { SelectService } from '../../services/select.service';

// Component
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    SelectService
  ]
})
export class SelectComponent {
  // Attributes
  @Input() placeholder?: string;

  open: boolean;

  // Constructor
  constructor(
    @Self() private service: SelectService
  ) {}

  // Methods
  toggleOpen() {
    this.open = !this.open;
  }
}
