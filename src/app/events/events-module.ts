import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing-module';
import { EventListComponent } from './event-list/event-list';
import { EventDetailComponent } from './event-detail/event-detail';
import { EventFormComponent } from './event-form/event-form';
import { SharedModule } from '../shared/shared-module';
import { ReviewFormComponent } from './review-form/review-form';

@NgModule({
  declarations: [EventListComponent, EventDetailComponent, EventFormComponent, ReviewFormComponent],
  imports: [CommonModule, EventsRoutingModule, SharedModule],
})
export class EventsModule {}
