import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  churchName = 'El-Shaddai International Pentecostal Church Berlin';
  address = 'Rothenburgstraße 12a-13, 12165 Berlin, Germany';

  instagram =
    'https://www.instagram.com/elshaddaiberlin?igsh=aWp6OWxvcHkwZWMy';

  youtube =
    'https://www.youtube.com/@ELSHADDAIGERMANYJOSHWASAGARAM';

  facebook =
    'https://www.facebook.com/profile.php?id=61574976716313';

  subscriberEmail = '';
  isSubscribing = false;
  subscriptionMessage = '';
  subscriptionError = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await getDoc(
        doc(db, 'siteContent', 'settings')
      );

      if (snapshot.exists()) {
        const settings = snapshot.data();

        this.churchName =
          settings['churchName'] || this.churchName;

        this.address =
          settings['address'] || this.address;

        this.instagram =
          settings['instagram'] || this.instagram;

        this.youtube =
          settings['youtube'] || this.youtube;

        this.facebook =
          settings['facebook'] || this.facebook;
      }
    } catch (error) {
      console.error(
        'Could not load footer settings:',
        error
      );
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async subscribe(): Promise<void> {
    this.subscriptionMessage = '';
    this.subscriptionError = '';

    const email =
      this.subscriberEmail.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      this.subscriptionError =
        'Enter a valid email address.';
      return;
    }

    this.isSubscribing = true;

    try {
      await addDoc(
        collection(db, 'subscribers'),
        {
          email,
          createdAt: serverTimestamp()
        }
      );

      this.subscriberEmail = '';

      this.subscriptionMessage =
        'Thank you for subscribing.';
    } catch (error) {
      console.error(
        'Newsletter subscription failed:',
        error
      );

      this.subscriptionError =
        'Subscription failed. Please try again.';
    } finally {
      this.isSubscribing = false;
      this.cdr.detectChanges();
    }
  }
}