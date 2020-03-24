import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  // Attributes
  logs: string[] = [];

  // Methods
  add(message: string) {
    this.logs.push(message);
  }

  clear() {
    this.logs = [];
  }
}
