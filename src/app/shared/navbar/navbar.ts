import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { User } from '../../core/models/user.model';

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => this.currentUser = user);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/events']);
  }
}
