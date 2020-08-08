import { Component, Input, OnInit, Self } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
export class SelectComponent implements OnInit {
  // Attributes
  @Input() placeholder?: string;

  open: boolean;
  values: any[];

  // Constructor
  constructor(
    @Self() private service: SelectService
  ) {}

  // Lifecycle
  ngOnInit() {
    this.service.selectedValues
      .subscribe(values => {
        this.values = values;
      });
  }

  // Methods
  toggleOpen() {
    this.open = !this.open;
  }

  closeOpen() {
    this.open = false;
  }
}
