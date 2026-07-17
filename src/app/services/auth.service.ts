import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import { auth } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User | null = null;
  authReady = false;

  constructor() {
    onAuthStateChanged(auth, user => {
      this.currentUser = user;
      this.authReady = true;
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}