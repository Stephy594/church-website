import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  imports: [],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {
  nextSundayDate = this.getNextSunday();

  getNextSunday(): string {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0

    const daysUntilSunday = day === 0 ? 0 : 7 - day;

    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);

    return nextSunday.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}