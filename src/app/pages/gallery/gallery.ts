import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

interface GalleryImage {
  id?: string;
  src: string;
  category: string;
  title?: string;
  managed?: boolean;
}

interface ManagedGalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title?: string;
  published: boolean;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit, OnDestroy {
  selectedCategory = 'ALL';
  isLoadingManagedImages = true;
  galleryError = '';
  private gallerySubscription?: Subscription;

  categories = [
    'ALL',
    'WORSHIP',
    'SUNDAY SCHOOL',
    'YOUTH',
    'LADIES MEETING',
    'EVENTS'
  ];

  heroSlides = [
    '/images/Instagram3_files/GalSlide1.jpg',
    '/images/Instagram3_files/GalSlide2.jpg',
    '/images/Instagram3_files/GalSlide3.jpg',
    '/images/Instagram3_files/GalSlide4.jpg'
  ];

  private staticImages: GalleryImage[] = [
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

  images: GalleryImage[] = [...this.staticImages];

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const publishedGalleryQuery = query(
      collection(this.firestore, 'galleryItems'),
      where('published', '==', true)
    );

    this.gallerySubscription = (
      collectionData(publishedGalleryQuery, { idField: 'id' })
    ).subscribe({
      next: records => {
        const managedImages = (records as ManagedGalleryItem[])
          .filter(item => !!item.imageUrl)
          .map(item => ({
            id: item.id,
            src: item.imageUrl,
            category: item.category || 'EVENTS',
            title: item.title,
            managed: true
          }));

        this.images = [...managedImages, ...this.staticImages];
        this.isLoadingManagedImages = false;
      },
      error: error => {
        console.error('Could not load managed gallery images:', error);
        this.galleryError = 'New gallery images are temporarily unavailable.';
        this.isLoadingManagedImages = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.gallerySubscription?.unsubscribe();
  }

  get filteredImages(): GalleryImage[] {
    if (this.selectedCategory === 'ALL') return this.images;
    return this.images.filter(image => image.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
