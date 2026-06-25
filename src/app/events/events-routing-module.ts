import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent }   from './event-list/event-list';
import { EventDetailComponent} from './event-detail/event-detail';
import { EventFormComponent }   from './event-form/event-form';
import { authGuard }            from '../core/guards/auth-guard';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
