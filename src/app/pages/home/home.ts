import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TestimonyService } from '../../services/testimony.service';
import { db } from '../../firebase';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where
} from 'firebase/firestore';

interface Testimony {
  name: string;
  message: string;
}

interface BibleVerseContent {
  reference: string;
  verse: string;
  theme?: string;
  published: boolean;
}

interface AnnouncementContent {
  id: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  @ViewChild('testimonyTrack')
  testimonyTrack?: ElementRef<HTMLElement>;

  showModal = false;
  isSubmitting = false;
  isTestimonyCarouselPaused = false;
  activeTestimonyIndex = 0;
  selectedTestimony: Testimony | null = null;

  private testimonyAutoSlideTimer?: ReturnType<typeof setInterval>;
  private readonly testimonyAutoSlideDelay = 6500;

  bibleVerse: BibleVerseContent = {
    reference: 'Isaiah 12:5',
    verse: 'Sing unto the LORD; for he hath done excellent things: this is known in all the earth.',
    theme: '',
    published: true
  };

  announcements: AnnouncementContent[] = [];
  isLoadingSiteContent = true;

  newTestimony: Testimony = {
    name: '',
    message: ''
  };

  testimonies: Testimony[] = [
    {
      name: 'Bilji C Mathew',
      message: `El Shaddai International Pentecostal Church Berlin has been a rock fort and truly a blessing for me and my spiritual growth. The ministry and the fellowship truly reflects Christ's love in action.

"For where two or three gather in my name, there am I with them." - Matthew 18:20`
    },
    {
      name: 'Niya Joseph',
      message: `This church offers a truly uplifting worship experience. The spiritual environment is peaceful and welcoming, helping everyone feel connected and refreshed. The worship services are meaningful, and the atmosphere encourages prayer, reflection, and spiritual growth. It is a wonderful place to strengthen faith and experience God's presence.`
    },
    {
      name: 'Jince Mary Prasad',
      message: `Experiencing God's promise at this church. "I will give you shepherds after my own heart." - Jeremiah 3:15. The pastor leads with wisdom, backed by prayers and has a welcoming heart for souls. Warm fellowship, genuine worship, blessed congregation.`
    },
    {
      name: 'Jibin',
      message: `El-Shaddai Ministries is not just a church—it is a home where lives are transformed, faith is strengthened, and hope is restored.`
    },
    {
      name: 'Lincy Ann George',
      message: `A church filled with true worship and the powerful presence of God. Everyone is welcomed with love, and you truly feel like part of a family.`
    }
  ];

  constructor(
    private testimonyService: TestimonyService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    // await Promise.all([
    //   this.loadApprovedTestimonies(),
    //   this.loadBibleVerse(),
    //   this.loadAnnouncements()
    // ]);
    this.loadBibleVerse();
this.loadAnnouncements();
this.loadApprovedTestimonies(); 

    this.isLoadingSiteContent = false;
    this.cdr.detectChanges();
    this.startTestimonyAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopTestimonyAutoSlide();
    document.body.style.overflow = '';
  }

  async loadApprovedTestimonies(): Promise<void> {
    try {
      const approvedTestimonies =
        await this.testimonyService.getApprovedTestimonies();

      const firebaseTestimonies: Testimony[] = approvedTestimonies.map(
        (testimony: any) => ({
          name: testimony.name,
          message: testimony.message
        })
      );

      this.testimonies = [
        ...firebaseTestimonies,
        ...this.testimonies
      ];
    } catch (error) {
      console.error('Error loading testimonies:', error);
    }
  }

  async loadBibleVerse(): Promise<void> {
    try {
      const snapshot = await getDoc(doc(db, 'siteContent', 'bibleVerse'));
      if (!snapshot.exists()) return;

      const content = snapshot.data() as Partial<BibleVerseContent>;
      if (content.published !== false && content.reference && content.verse) {
        this.bibleVerse = {
          reference: content.reference,
          verse: content.verse,
          theme: content.theme || '',
          published: true
        };
      }
    } catch (error) {
      console.error('Error loading Bible verse:', error);
    }
  }

  async loadAnnouncements(): Promise<void> {
    try {
      const announcementQuery = query(
        collection(db, 'announcements'),
        where('published', '==', true)
      );
      const snapshot = await getDocs(announcementQuery);

      this.announcements = snapshot.docs
        .map(document => ({
          id: document.id,
          title: String(document.data()['title'] || ''),
          message: String(document.data()['message'] || ''),
          createdAt: document.data()['createdAt']
        }))
        .sort(
          (first: any, second: any) =>
            (second.createdAt?.seconds ?? 0) -
            (first.createdAt?.seconds ?? 0)
        )
        .slice(0, 4);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  scrollTestimonies(direction: 'previous' | 'next'): void {
    const track = this.testimonyTrack?.nativeElement;
    if (!track || this.testimonies.length === 0) return;

    const firstCard = track.querySelector<HTMLElement>('.testimony-card');
    const computedGap = Number.parseFloat(
      window.getComputedStyle(track).columnGap ||
      window.getComputedStyle(track).gap ||
      '0'
    );
    const cardWidth = firstCard?.offsetWidth ?? track.clientWidth;
    const scrollAmount = cardWidth + computedGap;

    const atBeginning = track.scrollLeft <= 4;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (direction === 'next' && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      this.activeTestimonyIndex = 0;
    } else if (direction === 'previous' && atBeginning) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      this.activeTestimonyIndex = this.testimonies.length - 1;
    } else {
      track.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });

      const change = direction === 'next' ? 1 : -1;
      this.activeTestimonyIndex =
        (this.activeTestimonyIndex + change + this.testimonies.length) %
        this.testimonies.length;
    }

    this.restartTestimonyAutoSlide();
  }

  goToTestimony(index: number): void {
    const track = this.testimonyTrack?.nativeElement;
    if (!track || index < 0 || index >= this.testimonies.length) return;

    const cards = track.querySelectorAll<HTMLElement>('.testimony-card');
    const selectedCard = cards.item(index);
    if (!selectedCard) return;

    selectedCard.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });

    this.activeTestimonyIndex = index;
    this.restartTestimonyAutoSlide();
  }

  onTestimonyScroll(): void {
    const track = this.testimonyTrack?.nativeElement;
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>('.testimony-card')
    );
    if (cards.length === 0) return;

    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    this.activeTestimonyIndex = closestIndex;
  }

  pauseTestimonyCarousel(): void {
    this.isTestimonyCarouselPaused = true;
    this.stopTestimonyAutoSlide();
  }

  resumeTestimonyCarousel(): void {
    this.isTestimonyCarouselPaused = false;
    this.startTestimonyAutoSlide();
  }

  private startTestimonyAutoSlide(): void {
    if (
      this.isTestimonyCarouselPaused ||
      this.testimonyAutoSlideTimer ||
      this.testimonies.length <= 1
    ) {
      return;
    }

    this.testimonyAutoSlideTimer = setInterval(() => {
      this.scrollTestimonies('next');
    }, this.testimonyAutoSlideDelay);
  }

  private stopTestimonyAutoSlide(): void {
    if (!this.testimonyAutoSlideTimer) return;

    clearInterval(this.testimonyAutoSlideTimer);
    this.testimonyAutoSlideTimer = undefined;
  }

  private restartTestimonyAutoSlide(): void {
    this.stopTestimonyAutoSlide();
    this.startTestimonyAutoSlide();
  }

  scrollToService(): void {
    const element = document.getElementById('serviceInfo');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  isLongTestimony(testimony: Testimony): boolean {
    return testimony.message.trim().length > 320;
  }

  openFullTestimony(testimony: Testimony): void {
    this.selectedTestimony = testimony;
    this.pauseTestimonyCarousel();
    document.body.style.overflow = 'hidden';
  }

  closeFullTestimony(): void {
    this.selectedTestimony = null;
    document.body.style.overflow = '';
    this.resumeTestimonyCarousel();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  async addTestimony(): Promise<void> {
    const name = this.newTestimony.name.trim();
    const message = this.newTestimony.message.trim();

    if (!name || !message) {
      alert('Please enter your name and testimony.');
      return;
    }

    try {
      this.isSubmitting = true;
      this.cdr.detectChanges();

      await this.testimonyService.submitTestimony(name, message);

      this.newTestimony = {
        name: '',
        message: ''
      };

      this.showModal = false;
      this.isSubmitting = false;
      this.cdr.detectChanges();

      alert('Thank you! Your testimony has been submitted for approval.');
    } catch (error) {
      console.error('Error submitting testimony:', error);

      this.isSubmitting = false;
      this.cdr.detectChanges();

      alert('Sorry, your testimony could not be submitted. Please try again.');
    }
  }
}