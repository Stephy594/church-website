import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { Events } from './pages/events/events';
import { Gallery } from './pages/gallery/gallery';
import { Contact } from './pages/contact/contact';
import { ServiceDetail } from './pages/service-detail/service-detail';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },
  { path: 'services/:type', component: ServiceDetail },
  { path: 'events', component: Events },
  { path: 'gallery', component: Gallery },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];