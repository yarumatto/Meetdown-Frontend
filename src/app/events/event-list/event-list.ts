import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../core/services/event';
import { Event } from '../../core/models/event.model';

@Component({
  standalone: false,
  selector: 'app-event-list',
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  totalPages = 0;
  currentPage = 0;
  searchTerm = '';
  loading = false;

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.eventService.getEvents(this.currentPage).subscribe({
      next: page => {
        this.events = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) { this.load(); return; }
    this.loading = true;
    this.eventService.search(this.searchTerm).subscribe({
      next: page => { this.events = page.content; this.loading = false; this.cdr.detectChanges();},
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goTo(page: number): void { this.currentPage = page; this.load(); }
}