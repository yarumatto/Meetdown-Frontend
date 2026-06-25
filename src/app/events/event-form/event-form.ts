import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../core/services/event';
import { CategoryService } from '../../core/services/category';
import { Category, EventRequest } from '../../core/models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  standalone: false
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  eventId?: string;
  loading = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private catService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.eventId;

    this.form = this.fb.group({
      title:        ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description:  ['', Validators.maxLength(2000)],
      location:     ['', [Validators.required, Validators.maxLength(255)]],
      eventDate:    [null, Validators.required],
      eventTime:    ['19:00', Validators.required],   // heure séparée (le datepicker Material ne gère pas l'heure)
      maxAttendees: [0, [Validators.required, Validators.min(0)]],
      categoryId:   [null]
    });

    // Charger les catégories
    this.catService.getAll().subscribe({
      next: cats => this.categories = cats,
      error: () => {} // pas bloquant
    });

    // Pré-remplir en mode édition
    if (this.isEditMode) {
      this.eventService.getById(this.eventId!).subscribe(ev => {
        const d = new Date(ev.eventDate);
        this.form.patchValue({
          title: ev.title,
          description: ev.description,
          location: ev.location,
          eventDate: d,
          eventTime: `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,
          maxAttendees: ev.maxAttendees,
          categoryId: ev.categoryId ?? null
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    // Combiner date + heure en ISO string
    const date: Date = this.form.value.eventDate;
    const [h, m] = (this.form.value.eventTime as string).split(':');
    date.setHours(+h, +m, 0, 0);

    const payload: EventRequest = {
      title:        this.form.value.title,
      description:  this.form.value.description,
      location:     this.form.value.location,
      eventDate:    date.toISOString(),
      maxAttendees: this.form.value.maxAttendees,
      categoryId:   this.form.value.categoryId ?? undefined
    };

    const action$ = this.isEditMode
      ? this.eventService.update(this.eventId!, payload)
      : this.eventService.create(payload);

    action$.subscribe({
      next: ev => {
        this.snack.open(
          this.isEditMode ? '✅ Événement modifié' : '🎉 Événement créé !',
          '', { duration: 3000 }
        );
        this.router.navigate(['/events', ev.id]);
      },
      error: err => {
        this.snack.open(err.error?.message || 'Erreur serveur', 'OK', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  // Getter pour raccourcir les erreurs dans le template
  err(field: string, type: string): boolean {
    const c = this.form.get(field);
    return !!(c?.hasError(type) && c.touched);
  }
}