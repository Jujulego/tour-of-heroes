import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';

import { SelectService } from '../../services/select.service';
import { skip } from 'rxjs/operators';

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
  @Input() multiple = false;
  @Output() selectChange = new EventEmitter();

  open: boolean;
  values: any[];

  // Constructor
  constructor(
    @Self() private service: SelectService
  ) {}

  // Lifecycle
  ngOnInit() {
    this.service.multiple = this.multiple;

    this.service.$selectedValues
      .subscribe(values => {
        this.values = values;
      });

    this.service.$selectedValues
      .pipe(skip(1))
      .subscribe(values => {
        this.selectChange.emit(this.multiple ? values : values[0]);
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
