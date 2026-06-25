import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Event, EventRequest, PageResponse } from '../models/event.model';
import { Review, ReviewRequest, RegistrationResponse } from '../models/event.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {

  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  getEvents(page = 0, size = 12, from?: string, to?: string): Observable<PageResponse<Event>> {
  let params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', 'eventDate,asc');
  if (from) params = params.set('from', from);
  if (to)   params = params.set('to', to);
  return this.http.get<PageResponse<Event>>(this.apiUrl, { params });
}

  search(keyword: string, page = 0): Observable<PageResponse<Event>> {
    const params = new HttpParams().set('search', keyword).set('page', page);
    return this.http.get<PageResponse<Event>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/mine`);
  }

  create(req: EventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, req);
  }

  update(id: string, req: EventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  register(eventId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${eventId}/register`, {});
  }

  unregister(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/register`);
  }

  getRegistrationStatus(eventId: string): Observable<{ registered: boolean }> {
    return this.http.get<{ registered: boolean }>(
      `${this.apiUrl}/${eventId}/registration/status`
    );
  }
  getReviews(eventId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${eventId}/reviews`);
  }

  getMyReview(eventId: string): Observable<Review | null> {
    return this.http.get<Review>(`${this.apiUrl}/${eventId}/reviews/me`).pipe(
      catchError(err => err.status === 204 ? of(null) : of(null))
    );
  }

  createReview(eventId: string, req: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${eventId}/reviews`, req);
  }

  deleteReview(eventId: string, reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/reviews/${reviewId}`);
  }

  getParticipants(eventId: string): Observable<RegistrationResponse[]> {
    return this.http.get<RegistrationResponse[]>(`${this.apiUrl}/${eventId}/registrations`);
  }
}

