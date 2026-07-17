import { ApplicationConfig } from '@angular/core';
import { provideRouter,withInMemoryScrolling } from '@angular/router';
 
import {
  initializeApp,
  provideFirebaseApp
} from '@angular/fire/app';

import {
  getFirestore,
  provideFirestore
} from '@angular/fire/firestore';

import {
  getAuth,
  provideAuth
} from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
  routes,
  withInMemoryScrolling({
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })
),

    provideFirebaseApp(() =>
      initializeApp(environment.firebaseConfig)
    ),

    provideFirestore(() =>
      getFirestore()
    ),

    provideAuth(() =>
      getAuth()
    )
  ]
};