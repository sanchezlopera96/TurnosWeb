import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-wrapper">
      <nav class="navbar" *ngIf="isAuthenticated">
        <div class="navbar-brand">
          <span class="brand-icon">🏦</span>
          <span class="brand-name">TurnosBank</span>
        </div>
        <div class="navbar-links">
          <a (click)="navigate('/appointments')" class="nav-link">Turnos</a>
          <a *ngIf="isAdmin" (click)="navigate('/branches')" class="nav-link">Sucursales</a>
          <div class="nav-user">
            <span class="user-badge">{{ role }}</span>
            <span class="user-name">{{ identifier }}</span>
            <button class="btn-logout" (click)="logout()">Cerrar sesión</button>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, #272673, #1a2047);
      padding: 0 32px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 12px rgba(26, 32, 71, 0.3);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .brand-icon { font-size: 24px; }

    .brand-name {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .navbar-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .nav-link {
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.15); color: #ffffff; }
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 1px solid rgba(255,255,255,0.2);
      padding-left: 20px;
    }

    .user-badge {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .user-name {
      color: rgba(255,255,255,0.85);
      font-size: 13px;
    }

    .btn-logout {
      background: rgba(239,68,68,0.2);
      color: #fca5a5;
      border: 1px solid rgba(239,68,68,0.3);
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
      &:hover { background: rgba(239,68,68,0.4); color: #ffffff; }
    }

    .main-content {
      flex: 1;
      padding: 0;
    }
  `]
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get role(): string {
    return this.authService.getRole() || '';
  }

  get identifier(): string {
    return this.authService.getIdentifier() || '';
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}