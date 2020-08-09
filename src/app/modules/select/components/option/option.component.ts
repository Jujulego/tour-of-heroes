import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { SelectService } from 'src/app/modules/select/services/select.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Component
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit, OnDestroy {
  // Attributes
  @Input() value: any;

  private id: number;
  isSelected: Observable<boolean>;

  // Constructor
  constructor(
    private service: SelectService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  // Lifecycle
  ngOnInit() {
    this.id = this.service.register(
      this.value,
      this.elementRef.nativeElement.textContent.trim()
    );

    this.isSelected = this.service.$selectedIds
      .pipe(
        map(ids => (ids.indexOf(this.id) !== -1))
      );
  }

  ngOnDestroy() {
    this.service.unregister(this.id);
  }

  // Methods
  select() {
    this.service.toggle(this.id);
  }
}
