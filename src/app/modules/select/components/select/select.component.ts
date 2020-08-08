import { Component, Input, OnInit, Self } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  text: Observable<string>;
  open: boolean;

  // Constructor
  constructor(
    @Self() private service: SelectService
  ) {}

  // Lifecycle
  ngOnInit() {
    const sub = new BehaviorSubject(this.placeholder);

    this.service.value
      .subscribe(value => sub.next(value.toString()));

    this.text = sub.asObservable();
  }

  // Methods
  toggleOpen() {
    this.open = !this.open;
  }

  closeOpen() {
    this.open = false;
  }
}
