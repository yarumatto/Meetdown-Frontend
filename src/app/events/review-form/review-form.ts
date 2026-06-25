import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../core/services/event';
import { Review } from '../../core/models/event.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
  standalone: false
})
export class ReviewFormComponent implements OnInit {
  @Input() eventId!: string;
  @Input() existingReview: Review | null = null;
  @Output() reviewPosted = new EventEmitter<Review>();
  @Output() reviewDeleted = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  hoveredStar = 0;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rating:  [this.existingReview?.rating ?? 0, [Validators.required, Validators.min(1)]],
      content: [this.existingReview?.content ?? '', Validators.maxLength(1000)]
    });
  }

  setRating(star: number): void {
    this.form.patchValue({ rating: star });
  }

  submit(): void {
    if (this.form.value.rating === 0) {
      this.snack.open('Sélectionnez une note', '', { duration: 2000 });
      return;
    }
    this.loading = true;
    this.eventService.createReview(this.eventId, {
      rating: this.form.value.rating,
      content: this.form.value.content || undefined
    }).subscribe({
      next: review => {
        this.snack.open('Avis publié ⭐', '', { duration: 3000 });
        this.existingReview = review;
        this.loading = false;
        this.cdr.detectChanges();
        this.reviewPosted.emit(review);
      },
      error: err => {
        this.snack.open(err.error?.message || 'Erreur', 'OK', { duration: 4000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  delete(): void {
    if (!this.existingReview) return;
    this.eventService.deleteReview(this.eventId, this.existingReview.id).subscribe({
      next: () => {
        this.snack.open('Avis supprimé', '', { duration: 2000 });
        this.existingReview = null;
        this.form.patchValue({ rating: 0, content: '' });
        this.cdr.detectChanges();
        this.reviewDeleted.emit();
      }
    });
  }
}