import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loadingState = signal(false);
  private activeRequests = 0;

  readonly isLoading = this.loadingState.asReadonly();

  show(): void {
    this.activeRequests++;
    this.loadingState.set(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    if (this.activeRequests === 0) {
      this.loadingState.set(false);
    }
  }

  reset(): void {
    this.activeRequests = 0;
    this.loadingState.set(false);
  }
}