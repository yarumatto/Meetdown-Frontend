import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../core/services/event';
import { AuthService } from '../../core/services/auth';
import { Event, Review, RegistrationResponse } from '../../core/models/event.model';
import { User } from '../../core/models/user.model';

@Component({
  standalone: false,
  selector: 'app-event-detail',
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetailComponent implements OnInit {
  event!: Event;
  currentUser: User | null = null;
  isOrganizer = false;
  isRegistered = false;
  isPastEvent = false;
  loading = true;
  actionLoading = false;

  reviews: Review[] = [];
  myReview: Review | null = null;

  participants: RegistrationResponse[] = [];
  showParticipants = false;
  loadingParticipants = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public auth: AuthService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.eventService.getById(id).subscribe({
      next: ev => {
        this.event = ev;
        this.isOrganizer = this.currentUser?.id === ev.organizerId;
        this.isPastEvent = new Date(ev.eventDate) < new Date(); 
        this.loading = false;
        this.cdr.detectChanges();

        if (this.isPastEvent) this.loadReviews(id);

        if (this.auth.isLoggedIn && !this.isOrganizer) {
          this.checkRegistration(id);
          if (this.isPastEvent) this.loadMyReview(id);
        }
      },
      error: () => {
        this.snack.open('Événement introuvable', 'OK', { duration: 3000 });
        this.router.navigate(['/events']);
      }
    });
  }


  checkRegistration(eventId: string): void {
    this.eventService.getRegistrationStatus(eventId).subscribe({
      next: res => {
        this.isRegistered = res.registered;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadReviews(eventId: string): void {
    this.eventService.getReviews(eventId).subscribe({
      next: reviews => {
        this.reviews = reviews;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadMyReview(eventId: string): void {
    this.eventService.getMyReview(eventId).subscribe({
      next: review => {
        this.myReview = review;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
    if (this.showParticipants && this.participants.length === 0) {
      this.loadingParticipants = true;
      this.eventService.getParticipants(this.event.id).subscribe({
        next: p => {
          this.participants = p;
          this.loadingParticipants = false;
          this.cdr.detectChanges();
        },
        error: () => this.loadingParticipants = false
      });
    }
  }

  onReviewPosted(review: Review): void {
    this.myReview = review;
    this.loadReviews(this.event.id);
  }

  onReviewDeleted(): void {
    this.myReview = null;
    this.loadReviews(this.event.id);
  }

  register(): void {
    this.actionLoading = true;
    this.eventService.register(this.event.id).subscribe({
      next: () => {
        this.isRegistered = true;
        this.event.attendeeCount++;
        this.snack.open('Inscription confirmée ! 🎉', '', { duration: 3000 });
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.snack.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 });
        this.actionLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  unregister(): void {
    this.actionLoading = true;
    this.eventService.unregister(this.event.id).subscribe({
      next: () => {
        this.isRegistered = false;
        this.event.attendeeCount--;
        this.snack.open('Désinscription effectuée', '', { duration: 3000 });
        this.actionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.actionLoading = false
    });
  }

  delete(): void {
    if (!confirm('Supprimer cet événement définitivement ?')) return;
    this.eventService.delete(this.event.id).subscribe({
      next: () => {
        this.snack.open('Événement supprimé', '', { duration: 2000 });
        this.router.navigate(['/events']);
      },
      error: err => this.snack.open(err.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }
}