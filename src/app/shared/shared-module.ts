import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const MATERIAL = [
  MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
  MatChipsModule, MatProgressSpinnerModule, MatFormFieldModule,
  MatInputModule, MatSelectModule, MatSnackBarModule,
  MatDatepickerModule, MatNativeDateModule, MatPaginatorModule
];

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ...MATERIAL],
  exports: [NavbarComponent, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ...MATERIAL]
})
export class SharedModule { }