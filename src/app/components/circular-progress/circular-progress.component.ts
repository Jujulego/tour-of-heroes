import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent implements OnChanges {
  // Attributes
  @Input() value = 0;

  path = '';

  // Lifecycle
  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.computePath();
    }
  }

  // Methods
  private computePath() {
    const p = Math.max(Math.min(this.value / 100, 1), 0);
    const a = Math.PI * 2 * p;

    this.path = `M 0 0 v -1 A 1 1 ${a} ${p > .5 ? 1 : 0} 0 ${-Math.sin(a)} ${-Math.cos(a)} Z`
  }
}
