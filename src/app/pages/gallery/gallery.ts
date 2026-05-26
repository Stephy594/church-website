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

  images = [
    { src: 'images/Gallery/IMG_6735.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_6752.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_6753.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_6754.JPG.jpeg', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_6918.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_6919.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7020.PNG', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7021.PNG', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_7022.PNG', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7023.PNG', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7901.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_7902.JPG.jpeg', category: 'EVENTS' },

    { src: 'images/Gallery/IMG_7903.JPG.jpeg', category: 'LADIES MEETING' },
    { src: 'images/Gallery/IMG_7904.JPG.jpeg', category: 'LADIES MEETING' },
    { src: 'images/Gallery/IMG_7905.JPG.jpeg', category: 'LADIES MEETING' },
    { src: 'images/Gallery/IMG_7906.JPG.jpeg', category: 'LADIES MEETING' },

    { src: 'images/Gallery/IMG_8475.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8476.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8477.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8479.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8489.JPG.jpeg', category: 'WORSHIP' },
    { src: 'images/Gallery/IMG_8491.JPG.jpeg', category: 'EVENTS' },
    { src: 'images/Gallery/IMG_8493.JPG.jpeg', category: 'EVENTS' },
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