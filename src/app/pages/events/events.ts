import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

interface PublicChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  nextSundayDate = this.getNextSunday();
  managedEvents: PublicChurchEvent[] = [];
  isLoading = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    try {
      const eventQuery = query(
        collection(db, 'events'),
        where('published', '==', true)
      );
      const snapshot = await getDocs(eventQuery);

      this.managedEvents = snapshot.docs
        .map(document => ({
          id: document.id,
          title: String(document.data()['title'] || ''),
          date: String(document.data()['date'] || ''),
          time: String(document.data()['time'] || ''),
          location: String(document.data()['location'] || ''),
          description: String(document.data()['description'] || '')
        }))
        .filter(event => event.title && event.date)
        .sort((first, second) => first.date.localeCompare(second.date));
    } catch (error) {
      console.error('Could not load events:', error);
      this.errorMessage = 'The latest events could not be loaded.';
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
  }

  getNextSunday(): string {
    const today = new Date();
    const day = today.getDay();
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
