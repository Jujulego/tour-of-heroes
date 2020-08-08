import { Component } from '@angular/core';

type ValueType = '1' | '2' | '3';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent {
  // Attributes
  value: ValueType = '1';

  // Methods
  change(value: ValueType) {
    this.value = value;
  }

  print(value: any) {
    console.log(value);
  }
}
