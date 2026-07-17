import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

interface PrayerRequestItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category: string;
  request: string;
  isPrivate: boolean;
  permissionToContact: boolean;
  status: 'new' | 'prayed';
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

@Component({
  selector: 'app-admin-prayer-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-prayer-requests.html',
  styleUrl: './admin-prayer-requests.css'
})
export class AdminPrayerRequests implements OnInit {
  prayerRequests$!: Observable<PrayerRequestItem[]>;

  processingId: string | null = null;
  actionError = '';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
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
      {
        idField: 'id'
      }
    ) as Observable<PrayerRequestItem[]>;
  }

  async markAsPrayed(requestId: string): Promise<void> {
    await this.updateRequestStatus(requestId, 'prayed');
  }

  async markAsNew(requestId: string): Promise<void> {
    await this.updateRequestStatus(requestId, 'new');
  }

  private async updateRequestStatus(
    requestId: string,
    status: 'new' | 'prayed'
  ): Promise<void> {
    this.actionError = '';
    this.processingId = requestId;

    try {
      const requestReference = doc(
        this.firestore,
        'prayerRequests',
        requestId
      );

      await updateDoc(requestReference, {
        status
      });
    } catch (error) {
      console.error('Could not update prayer request:', error);

      this.actionError =
        'The prayer request could not be updated. Please try again.';
    } finally {
      this.processingId = null;
    }
  }

  async deletePrayerRequest(
    requestId: string,
    personName: string
  ): Promise<void> {
    const displayName = personName?.trim() || 'Anonymous';

    const shouldDelete = window.confirm(
      `Delete the prayer request from ${displayName}?`
    );

    if (!shouldDelete) {
      return;
    }

    this.actionError = '';
    this.processingId = requestId;

    try {
      const requestReference = doc(
        this.firestore,
        'prayerRequests',
        requestId
      );

      await deleteDoc(requestReference);
    } catch (error) {
      console.error('Could not delete prayer request:', error);

      this.actionError =
        'The prayer request could not be deleted. Please try again.';
    } finally {
      this.processingId = null;
    }
  }

  getInitial(name: string): string {
    const normalizedName = name?.trim();

    return normalizedName
      ? normalizedName.charAt(0).toUpperCase()
      : 'P';
  }

  getNewCount(prayerRequests: PrayerRequestItem[]): number {
    return prayerRequests.filter(
      request => request.status === 'new'
    ).length;
  }

  getPrayedCount(prayerRequests: PrayerRequestItem[]): number {
    return prayerRequests.filter(
      request => request.status === 'prayed'
    ).length;
  }

  trackByRequestId(
    _index: number,
    prayerRequest: PrayerRequestItem
  ): string {
    return prayerRequest.id;
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

    return new Date(
      createdAt.seconds * 1000
    ).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCategory(category: string): string {
    if (!category) {
      return 'Other';
    }

    return category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, character =>
        character.toUpperCase()
      );
  }
}