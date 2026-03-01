import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">

        <div class="login-header">
          <span class="bank-icon">🏦</span>
          <h1>TurnosBank</h1>
          <p>Sistema de Agendamiento de Turnos</p>
        </div>

        <div class="tab-group">
          <button
            class="tab"
            [class.active]="activeTab === 'client'"
            (click)="activeTab = 'client'">
            Cliente
          </button>
          <button
            class="tab"
            [class.active]="activeTab === 'admin'"
            (click)="activeTab = 'admin'">
            Administrador
          </button>
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Client Login -->
        <div *ngIf="activeTab === 'client'" class="form-section">
          <div class="form-group">
            <label>Número de Cédula</label>
            <input
              type="text"
              [(ngModel)]="clientForm.idNumber"
              placeholder="Ingresa tu número de cédula"
              [class.error]="submitted && !clientForm.idNumber"/>
            <span class="error-msg" *ngIf="submitted && !clientForm.idNumber">
              La cédula es requerida
            </span>
          </div>
          <button
            class="btn btn-primary btn-full"
            (click)="loginClient()"
            [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar como Cliente' }}
          </button>
        </div>

        <!-- Admin Login -->
        <div *ngIf="activeTab === 'admin'" class="form-section">
          <div class="form-group">
            <label>Usuario</label>
            <input
              type="text"
              [(ngModel)]="adminForm.username"
              placeholder="Ingresa tu usuario"
              [class.error]="submitted && !adminForm.username"/>
            <span class="error-msg" *ngIf="submitted && !adminForm.username">
              El usuario es requerido
            </span>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              [(ngModel)]="adminForm.password"
              placeholder="Ingresa tu contraseña"
              [class.error]="submitted && !adminForm.password"/>
            <span class="error-msg" *ngIf="submitted && !adminForm.password">
              La contraseña es requerida
            </span>
          </div>
          <button
            class="btn btn-primary btn-full"
            (click)="loginAdmin()"
            [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar como Administrador' }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a2047 0%, #272673 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .login-container {
      background: #ffffff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(26, 32, 71, 0.4);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      .bank-icon { font-size: 48px; }

      h1 {
        color: #272673;
        font-size: 26px;
        font-weight: 700;
        margin: 8px 0 4px;
      }

      p {
        color: #6b7280;
        font-size: 13px;
      }
    }

    .tab-group {
      display: flex;
      background: #f5f6fa;
      border-radius: 8px;
      padding: 4px;
      margin-bottom: 24px;
    }

    .tab {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.2s;

      &.active {
        background: #272673;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(39, 38, 115, 0.3);
      }
    }

    .form-section { margin-top: 8px; }

    .btn-full {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      margin-top: 8px;
    }
  `]
})
export class LoginComponent {
  activeTab: 'client' | 'admin' = 'client';
  loading = false;
  submitted = false;
  errorMessage = '';

  clientForm = { idNumber: '' };
  adminForm = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginClient(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.clientForm.idNumber) return;

    this.loading = true;
    this.authService.clientLogin({ idNumber: this.clientForm.idNumber }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/appointments']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al conectar con el servidor.';
      }
    });
  }

  loginAdmin(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.adminForm.username || !this.adminForm.password) return;

    this.loading = true;
    this.authService.adminLogin({
      username: this.adminForm.username,
      password: this.adminForm.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/appointments']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Credenciales inválidas.';
      }
    });
  }
}