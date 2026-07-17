import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface SiteSettings {
  churchName: string;
  email: string;
  phone: string;
  address: string;
  serviceTime: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  settings: SiteSettings = {
    churchName: 'El-Shaddai International Pentecostal Church Berlin',
    email: '',
    phone: '+49 17630779106',
    address: 'Rothenburgstraße 12a-13, 12165 Berlin, Germany',
    serviceTime: 'Every Sunday | 4 PM – 7 PM',
    facebook: '',
    instagram: '',
    youtube: ''
  };

  form = { name: '', email: '', subject: '', message: '' };
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await getDoc(doc(db, 'siteContent', 'settings'));
      if (snapshot.exists()) {
        this.settings = { ...this.settings, ...snapshot.data() } as SiteSettings;
      }
    } catch (error) {
      console.error('Could not load site settings:', error);
    }
  }

  async submitMessage(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.errorMessage = 'Please enter your name, email address, and message.';
      return;
    }

    this.isSubmitting = true;
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: this.form.name.trim(),
        email: this.form.email.trim().toLowerCase(),
        subject: this.form.subject.trim(),
        message: this.form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp()
      });

      this.form = { name: '', email: '', subject: '', message: '' };
      this.successMessage = 'Thank you. Your message has been sent to the church team.';
    } catch (error) {
      console.error('Contact message submission failed:', error);
      this.errorMessage = 'Your message could not be sent. Please try again.';
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}
