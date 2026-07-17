import { Injectable } from '@angular/core';
import { db } from '../firebase';

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

export interface Testimony {
  id?: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {

  private readonly testimonyRef = collection(db, 'testimonies');

  async submitTestimony(name: string, message: string): Promise<void> {
    await addDoc(this.testimonyRef, {
      name,
      message,
      approved: false,
      createdAt: serverTimestamp()
    });
  }

 async getApprovedTestimonies(): Promise<Testimony[]> {
  const approvedQuery = query(
    this.testimonyRef,
    where('approved', '==', true)
  );

  const snapshot = await getDocs(approvedQuery);

  const testimonies = snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  } as Testimony));

  return testimonies.sort((a: any, b: any) => {
    const firstDate = a.createdAt?.seconds ?? 0;
    const secondDate = b.createdAt?.seconds ?? 0;

    return secondDate - firstDate;
  });
}

 async getPendingTestimonies(): Promise<Testimony[]> {
  const pendingQuery = query(
    this.testimonyRef,
    where('approved', '==', false)
  );

  const snapshot = await getDocs(pendingQuery);

  const testimonies = snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  } as Testimony));

  return testimonies.sort((a: any, b: any) => {
    const firstDate = a.createdAt?.seconds ?? 0;
    const secondDate = b.createdAt?.seconds ?? 0;

    return secondDate - firstDate;
  });
}

  async approveTestimony(id: string): Promise<void> {
    const testimonyDocument = doc(db, 'testimonies', id);

    await updateDoc(testimonyDocument, {
      approved: true
    });
  }

  async deleteTestimony(id: string): Promise<void> {
    const testimonyDocument = doc(db, 'testimonies', id);

    await deleteDoc(testimonyDocument);
  }
}