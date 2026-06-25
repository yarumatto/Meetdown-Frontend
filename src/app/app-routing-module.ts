import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }       from './auth/login/login';
import { RegisterComponent }    from './auth/register/register';
import { EventListComponent }   from './events/event-list/event-list';
import { EventDetailComponent } from './events/event-detail/event-detail';
import { EventFormComponent }   from './events/event-form/event-form';
import { authGuard }            from './core/guards/auth-guard';

const routes: Routes = [
  { path: '',                  redirectTo: 'events', pathMatch: 'full' },
  { path: 'auth/login',        component: LoginComponent },
  { path: 'auth/register',     component: RegisterComponent },
  { path: 'events',            component: EventListComponent },
  { path: 'events/new',        component: EventFormComponent,   canActivate: [authGuard] },
  { path: 'events/:id/edit',   component: EventFormComponent,   canActivate: [authGuard] },
  { path: 'events/:id',        component: EventDetailComponent },
  { path: '**',                redirectTo: 'events' }   // ← doit être EN DERNIER
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
