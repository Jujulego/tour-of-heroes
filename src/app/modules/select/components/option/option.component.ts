import { Component } from '@angular/core';
import { SelectService } from 'src/app/modules/select/services/select.service';

// Component
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent {
  // Constructor
  constructor(
    private service: SelectService
  ) {}
}
