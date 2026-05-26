import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import AOS from 'aos';
import { filter } from 'rxjs';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          AOS.refreshHard();
        }, 300);
      });
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 120
    });
  }

  showScrollButton = false;

@HostListener('window:scroll', [])
onWindowScroll() {

  this.showScrollButton = window.scrollY > 300;

}

scrollToTop() {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}
}