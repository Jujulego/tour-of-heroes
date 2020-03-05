import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppBarService {
  // Attributes
  back = false;

  // Methods
  showBack() {
    this.back = true;
  }
}
