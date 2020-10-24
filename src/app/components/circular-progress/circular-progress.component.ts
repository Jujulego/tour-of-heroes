import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// Component
@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent implements OnChanges {
  // Attributes
  @Input() value = 0;
  @Input() duration = 500;

  rounded = 0;
  path = '';

  private animation: number = null;
  private current = 0;

  // Lifecycle
  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.animatePath(this.value);
    }
  }

  // Methods
  private cancelAnimation() {
    if (this.animation) {
      cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }

  private animatePath(value: number) {
    this.cancelAnimation();

    // Animation callback
    const first = this.current;
    let start: number;

    const animate = (time: number) => {
      if (!start) {
        start = time;
      }

      // Compute animated current value
      const elapsed = time - start;
      this.current = first + (value - first) * Math.min(elapsed / this.duration, 1);
      this.rounded = Math.round(this.current);

      this.computePath(this.current);

      // Continue animation
      if (this.current !== value) {
        this.animation = requestAnimationFrame(animate);
      } else {
        this.animation = null;
      }
    };

    this.animation = requestAnimationFrame(animate);
  }

  private computePath(value: number) {
    const p = Math.max(Math.min(value / 100, 1), 0);
    const a = Math.PI * 2 * p;

    this.path = `M 0 0 v -1 A 1 1 ${a} ${p > .5 ? 1 : 0} 0 ${-Math.sin(a)} ${-Math.cos(a)} Z`;
  }
}
