import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { ServiceDetail } from './pages/service-detail/service-detail';
import { Events } from './pages/events/events';
import { Gallery } from './pages/gallery/gallery';
import { Contact } from './pages/contact/contact';
import { PrayerRequest } from './pages/prayer-request/prayer-request';

import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminPrayerRequests } from './pages/admin-prayer-requests/admin-prayer-requests';
import { AdminTestimonies } from './pages/admin-testimonies/admin-testimonies';
import { AdminEvents } from './pages/admin-events/admin-events';
import { AdminGallery } from './pages/admin-gallery/admin-gallery';
import { AdminBibleVerse } from './pages/admin-bible-verse/admin-bible-verse';
import { AdminContactMessages } from './pages/admin-contact-messages/admin-contact-messages';
import { AdminSubscribers } from './pages/admin-subscribers/admin-subscribers';
import { AdminAnnouncements } from './pages/admin-announcements/admin-announcements';
import { AdminSettings } from './pages/admin-settings/admin-settings';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
      { path: 'services', component: Services },
      { path: 'services/:type', component: ServiceDetail },
      { path: 'events', component: Events },
      { path: 'gallery', component: Gallery },
      { path: 'contact', component: Contact },
      { path: 'prayer-request', component: PrayerRequest }
    ]
  },
  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboard, title: 'Dashboard | El-Shaddai Admin' },
      { path: 'testimonies', component: AdminTestimonies, title: 'Testimonies | El-Shaddai Admin' },
      { path: 'prayer-requests', component: AdminPrayerRequests, title: 'Prayer Requests | El-Shaddai Admin' },
      { path: 'events', component: AdminEvents, title: 'Events | El-Shaddai Admin' },
      { path: 'gallery', component: AdminGallery, title: 'Gallery | El-Shaddai Admin' },
      { path: 'bible-verse', component: AdminBibleVerse, title: 'Bible Verse | El-Shaddai Admin' },
      { path: 'contact-messages', component: AdminContactMessages, title: 'Contact Messages | El-Shaddai Admin' },
      { path: 'subscribers', component: AdminSubscribers, title: 'Subscribers | El-Shaddai Admin' },
      { path: 'announcements', component: AdminAnnouncements, title: 'Announcements | El-Shaddai Admin' },
      { path: 'settings', component: AdminSettings, title: 'Settings | El-Shaddai Admin' }
    ]
  },
  { path: '**', redirectTo: '' }
];
