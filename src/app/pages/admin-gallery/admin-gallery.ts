import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp
} from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Observable } from 'rxjs';
import { storage } from '../../firebase';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  storagePath?: string;
  category: string;
  published: boolean;
  createdAt?: unknown;
}

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-gallery.html',
  styleUrl: './admin-gallery.css'
})
export class AdminGallery implements OnInit {
  items$!: Observable<GalleryItem[]>;
  selectedFile: File | null = null;
  previewUrl = '';
  busy = false;
  message = '';
  errorMessage = '';
  uploadProgressText = '';

  form = {
    title: '',
    category: 'WORSHIP',
    published: true
  };

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const galleryQuery = query(
      collection(this.firestore, 'galleryItems'),
      orderBy('createdAt', 'desc')
    );

    this.items$ = collectionData(galleryQuery, {
      idField: 'id'
    }) as Observable<GalleryItem[]>;
  }

  onFileSelected(event: Event): void {
    this.clearMessages();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.previewUrl = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file.';
      input.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      this.errorMessage = 'The image must be smaller than 8 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);

    if (!this.form.title.trim()) {
      this.form.title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
  }

  async uploadImage(fileInput: HTMLInputElement): Promise<void> {
    this.clearMessages();

    if (!this.selectedFile) {
      this.errorMessage = 'Choose an image before uploading.';
      return;
    }

    this.busy = true;
    let storagePath = '';

    try {
      const safeName = this.selectedFile.name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/^-|-$/g, '');

      storagePath = `gallery/${Date.now()}-${safeName}`;
      const storageReference = ref(storage, storagePath);

      this.uploadProgressText = 'Uploading image…';
      await uploadBytes(storageReference, this.selectedFile, {
        contentType: this.selectedFile.type
      });

      this.uploadProgressText = 'Saving gallery entry…';
      const imageUrl = await getDownloadURL(storageReference);

      await addDoc(collection(this.firestore, 'galleryItems'), {
        title: this.form.title.trim() || 'Church gallery image',
        imageUrl,
        storagePath,
        category: this.form.category,
        published: this.form.published,
        createdAt: serverTimestamp()
      });

      this.message = this.form.published
        ? 'Image uploaded and published on the public gallery.'
        : 'Image uploaded as a draft.';

      this.reset(fileInput);
    } catch (error) {
      console.error('Gallery upload failed:', error);
      this.errorMessage =
        'The image could not be uploaded. Check Firebase Storage setup and rules.';

      if (storagePath) {
        try {
          await deleteObject(ref(storage, storagePath));
        } catch {
          // Ignore cleanup errors when the upload itself did not finish.
        }
      }
    } finally {
      this.busy = false;
      this.uploadProgressText = '';
    }
  }

  async remove(item: GalleryItem): Promise<void> {
    const confirmed = confirm(`Delete “${item.title || 'this image'}”?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(this.firestore, 'galleryItems', item.id));

      if (item.storagePath) {
        await deleteObject(ref(storage, item.storagePath));
      }

      this.message = 'Gallery image deleted.';
    } catch (error) {
      console.error('Could not delete gallery image:', error);
      this.errorMessage = 'The gallery image could not be deleted.';
    }
  }

  private reset(fileInput: HTMLInputElement): void {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.selectedFile = null;
    this.previewUrl = '';
    fileInput.value = '';
    this.form = {
      title: '',
      category: 'WORSHIP',
      published: true
    };
  }

  private clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }
}
