import { Component, Self } from '@angular/core';

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
  // Constructor
  constructor(
    @Self() private service: SelectService
  ) {}
}
