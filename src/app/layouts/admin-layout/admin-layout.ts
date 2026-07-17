import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  isSidebarOpen = false;

  // This can later be connected to your pending-testimony count service.
  pendingTestimoniesLabel = 'Review';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/admin/login']);
  }
}