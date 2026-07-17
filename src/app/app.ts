import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'; 
import AOS from 'aos';
import { filter } from 'rxjs';
import { HostListener } from '@angular/core';


import { Loader } from './shared/loader/loader';
import { LoaderService } from './services/loader.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

  constructor(private router: Router,
    private loaderService: LoaderService) {
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

// testLoader(): void {
//   this.loaderService.show();

//   setTimeout(() => {
//     this.loaderService.hide();
//   }, 3000);
// }
}