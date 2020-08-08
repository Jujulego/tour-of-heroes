import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SelectService } from 'src/app/modules/select/services/select.service';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

// Component
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
  // Attributes
  @Input() value: any;
  isSelected: Observable<boolean>;

  // Constructor
  constructor(
    private service: SelectService
  ) {}

  // Lifecycle
  ngOnInit() {
    this.isSelected = this.service.value
      .pipe(
        map(value => value === this.value)
      );
  }

  // Methods
  select() {
    this.service.select(this.value);
  }
}
