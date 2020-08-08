import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SelectService } from 'src/app/modules/select/services/select.service';
import { Observable } from 'rxjs';
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

  private id: number;
  isSelected: Observable<boolean>;

  // Constructor
  constructor(
    private service: SelectService
  ) {}

  // Lifecycle
  ngOnInit() {
    this.id = this.service.register(this.value);

    this.isSelected = this.service.selectedIds
      .pipe(
        map(ids => (ids.indexOf(this.id) !== -1))
      );
  }

  // Methods
  select() {
    this.service.select(this.id);
  }
}
