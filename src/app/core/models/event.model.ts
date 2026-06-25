export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;       // ISO string venant de l'API
  maxAttendees: number;
  attendeeCount: number;
  full: boolean;
  status: 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED';
  organizerId: string;
  organizerUsername: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  location: string;
  eventDate: string;       // ISO string envoyé à l'API
  maxAttendees: number;
  categoryId?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Review {
  id: string;
  rating: number;
  content?: string;
  userId: string;
  username: string;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  content?: string;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  username: string;
  status: string;
  registeredAt: string;
}