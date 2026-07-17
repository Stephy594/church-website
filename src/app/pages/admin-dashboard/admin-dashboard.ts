import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import {
  Testimony,
  TestimonyService
} from '../../services/testimony.service';

interface PrayerRequestItem {
  id: string;
  name: string;
  category: string;
  request: string;
  status: 'new' | 'prayed';
  isPrivate: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, OnDestroy {
  prayerRequests$!: Observable<PrayerRequestItem[]>;

  latestPrayerRequests: PrayerRequestItem[] = [];
  totalPrayerRequests = 0;
  newPrayerRequests = 0;
  prayedPrayerRequests = 0;

  pendingTestimonies: Testimony[] = [];
  approvedTestimonies: Testimony[] = [];

  isLoading = true;
  processingId: string | null = null;
  errorMessage = '';

  private prayerRequestsSubscription?: Subscription;

  constructor(
    private testimonyService: TestimonyService,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadAllTestimonies();
    this.loadPrayerRequestSummary();
  }

  ngOnDestroy(): void {
    this.prayerRequestsSubscription?.unsubscribe();
  }

  private loadPrayerRequestSummary(): void {
    const prayerRequestsCollection = collection(
      this.firestore,
      'prayerRequests'
    );

    const prayerRequestsQuery = query(
      prayerRequestsCollection,
      orderBy('createdAt', 'desc')
    );

    this.prayerRequests$ = collectionData(
      prayerRequestsQuery,
      { idField: 'id' }
    ) as Observable<PrayerRequestItem[]>;

    this.prayerRequestsSubscription = this.prayerRequests$.subscribe({
      next: prayerRequests => {
        this.totalPrayerRequests = prayerRequests.length;
        this.newPrayerRequests = prayerRequests.filter(
          request => request.status === 'new'
        ).length;
        this.prayedPrayerRequests = prayerRequests.filter(
          request => request.status === 'prayed'
        ).length;
        this.latestPrayerRequests = prayerRequests.slice(0, 3);
      },
      error: error => {
        console.error(
          'Could not load prayer request dashboard data:',
          error
        );
      }
    });
  }

  async loadAllTestimonies(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const [pending, approved] = await Promise.all([
        this.testimonyService.getPendingTestimonies(),
        this.testimonyService.getApprovedTestimonies()
      ]);

      this.pendingTestimonies = pending;
      this.approvedTestimonies = approved;
    } catch (error) {
      console.error('Error loading testimonies:', error);
      this.errorMessage = 'Testimonies could not be loaded.';
    } finally {
      this.isLoading = false;
    }
  }

  async approveTestimony(testimony: Testimony): Promise<void> {
    if (!testimony.id) {
      return;
    }

    try {
      this.processingId = testimony.id;
      await this.testimonyService.approveTestimony(testimony.id);

      this.pendingTestimonies = this.pendingTestimonies.filter(
        item => item.id !== testimony.id
      );

      this.approvedTestimonies.unshift({
        ...testimony,
        approved: true
      });

      alert('Testimony approved successfully.');
    } catch (error) {
      console.error('Error approving testimony:', error);
      alert('The testimony could not be approved.');
    } finally {
      this.processingId = null;
    }
  }

  async deleteTestimony(testimony: Testimony): Promise<void> {
    if (!testimony.id) {
      return;
    }

    const confirmed = confirm(
      `Delete the testimony submitted by ${testimony.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      this.processingId = testimony.id;
      await this.testimonyService.deleteTestimony(testimony.id);

      this.pendingTestimonies = this.pendingTestimonies.filter(
        item => item.id !== testimony.id
      );
    } catch (error) {
      console.error('Error deleting testimony:', error);
      alert('The testimony could not be deleted.');
    } finally {
      this.processingId = null;
    }
  }

  async deleteApprovedTestimony(testimony: Testimony): Promise<void> {
    if (!testimony.id) {
      return;
    }

    const confirmed = confirm(
      `Remove the published testimony from ${testimony.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      this.processingId = testimony.id;
      await this.testimonyService.deleteTestimony(testimony.id);

      this.approvedTestimonies = this.approvedTestimonies.filter(
        item => item.id !== testimony.id
      );
    } catch (error) {
      console.error('Error deleting approved testimony:', error);
      alert('The approved testimony could not be removed.');
    } finally {
      this.processingId = null;
    }
  }

  getInitial(name?: string): string {
    return name?.trim().charAt(0).toUpperCase() || 'A';
  }

  formatCategory(category: string): string {
    if (!category) {
      return 'Other';
    }

    return category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  formatDate(
    createdAt?: {
      seconds: number;
      nanoseconds: number;
    }
  ): string {
    if (!createdAt?.seconds) {
      return 'Date unavailable';
    }

    return new Date(createdAt.seconds * 1000).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/admin/login']);
  }
}