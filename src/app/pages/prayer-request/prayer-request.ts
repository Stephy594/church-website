import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  serverTimestamp
} from '@angular/fire/firestore';

@Component({
  selector: 'app-prayer-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './prayer-request.html',
  styleUrl: './prayer-request.css'
})
export class PrayerRequest {
  prayerForm: FormGroup;

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private formBuilder: FormBuilder,
    private firestore: Firestore,
    private location: Location
  ) {
    this.prayerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: [''],
      category: ['', Validators.required],
      request: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(2000)
        ]
      ],
      isPrivate: [false],
      permissionToContact: [false]
    });
  }

  get nameControl() {
    return this.prayerForm.get('name');
  }

  get emailControl() {
    return this.prayerForm.get('email');
  }

  get categoryControl() {
    return this.prayerForm.get('category');
  }

  get requestControl() {
    return this.prayerForm.get('request');
  }

  goBack(): void {
    this.location.back();
  }

  async submitPrayerRequest(): Promise<void> {
    this.submitSuccess = false;
    this.submitError = '';

    if (this.prayerForm.invalid) {
      this.prayerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.prayerForm.getRawValue();

      await addDoc(
        collection(this.firestore, 'prayerRequests'),
        {
          name: formValue.name.trim(),
          email: formValue.email?.trim() || '',
          phone: formValue.phone?.trim() || '',
          category: formValue.category,
          request: formValue.request.trim(),
          isPrivate: formValue.isPrivate,
          permissionToContact: formValue.permissionToContact,
          status: 'new',
          createdAt: serverTimestamp()
        }
      );

      this.submitSuccess = true;

      this.prayerForm.reset({
        name: '',
        email: '',
        phone: '',
        category: '',
        request: '',
        isPrivate: false,
        permissionToContact: false
      });
    } catch (error) {
      console.error('Prayer request submission failed:', error);

      this.submitError =
        'We could not submit your prayer request. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}