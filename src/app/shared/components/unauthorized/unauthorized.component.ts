import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="unauthorized">
      <h1>Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <button (click)="goBack()">Volver</button>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}