import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [NgFor],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery {
  selectedCategory = 'ALL';

  categories = ['ALL', 'WORSHIP', 'SUNDAY SCHOOL', 'YOUTH', 'LADIES MEETING', 'EVENTS'];

 heroSlides = [
  '/images/Instagram3_files/GalSlide1.jpg',
  '/images/Instagram3_files/GalSlide2.jpg',
  '/images/Instagram3_files/GalSlide3.jpg',
  '/images/Instagram3_files/GalSlide4.jpg'
];

  images = [
    { src: 'images/Gallery/IMG_6735.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_6752.JPG.jpeg', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_6919.JPG.jpeg', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_7022.PNG', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7901.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7902.JPG.jpeg', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_7904.JPG.jpeg', category: 'LADIES MEETING' },
    { src: 'images/Gallery/IMG_7906.JPG.jpeg', category: 'LADIES MEETING' },

    { src: 'images/Gallery/GalSlide4.jpg', category: 'WORSHIP' },
    { src: 'images/Gallery/Worship2.jpg', category: 'WORSHIP' },
    { src: 'images/Gallery/Worship3.jpg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8479.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8489.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8491.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_8496.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8497.JPG.jpeg', category: 'WORSHIP' }
  ];

  get filteredImages() {
    if (this.selectedCategory === 'ALL') {
      return this.images;
    }

    return this.images.filter(img => img.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}