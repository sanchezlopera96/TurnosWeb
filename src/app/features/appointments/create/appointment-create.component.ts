import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { BranchService } from '../../../core/services/branch.service';
import { AuthService } from '../../../core/services/auth.service';
import { Branch } from '../../../core/models/branch.model';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Agendar Turno</h2>
        <button class="btn btn-secondary" (click)="goBack()">← Volver</button>
      </div>

      <div class="card" style="max-width: 500px;">

        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label>Número de Cédula</label>
          <input
            type="text"
            [(ngModel)]="form.customerIdNumber"
            placeholder="Ingresa tu cédula"
            [class.error]="submitted && !form.customerIdNumber"/>
          <span class="error-msg" *ngIf="submitted && !form.customerIdNumber">
            La cédula es requerida
          </span>
        </div>

        <div class="form-group">
          <label>Sucursal</label>
          <select
            [(ngModel)]="form.branchId"
            [class.error]="submitted && !form.branchId">
            <option value="">Selecciona una sucursal</option>
            <option *ngFor="let branch of branches" [value]="branch.id">
              {{ branch.name }} — {{ branch.city }}
            </option>
          </select>
          <span class="error-msg" *ngIf="submitted && !form.branchId">
            La sucursal es requerida
          </span>
        </div>

        <div class="info-box" *ngIf="form.branchId">
          <span>⏱️</span>
          <p>Tienes <strong>15 minutos</strong> para llegar a la sucursal y activar tu turno.</p>
        </div>

        <button
          class="btn btn-primary btn-full"
          (click)="create()"
          [disabled]="loading">
          {{ loading ? 'Agendando...' : 'Agendar Turno' }}
        </button>

      </div>

      <!-- Turno creado -->
      <div class="card appointment-result" *ngIf="createdAppointment">
        <h3>✅ Turno Agendado</h3>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Código</span>
            <span class="result-value code">{{ createdAppointment.code }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Sucursal</span>
            <span class="result-value">{{ createdAppointment.branchName }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Expira en</span>
            <span class="result-value timer">{{ remainingTime }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Estado</span>
            <span class="badge badge-pending">Pendiente</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .info-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #1e40af;
    }

    .btn-full { width: 100%; padding: 12px; }

    .appointment-result {
      max-width: 500px;
      margin-top: 24px;

      h3 {
        color: #059669;
        margin-bottom: 20px;
        font-size: 18px;
      }
    }

    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .result-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .result-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
    }

    .result-value {
      font-size: 15px;
      color: #1a2047;
      font-weight: 500;

      &.code {
        font-size: 22px;
        font-weight: 700;
        color: #272673;
        letter-spacing: 2px;
      }

      &.timer {
        font-size: 18px;
        font-weight: 700;
        color: #d97706;
      }
    }
  `]
})
export class AppointmentCreateComponent implements OnInit {
  branches: Branch[] = [];
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  createdAppointment: any = null;
  remainingTime = '';
  private timerInterval: any;

  form = {
    customerIdNumber: '',
    branchId: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private branchService: BranchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form.customerIdNumber = this.authService.getIdentifier() || '';
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getAll().subscribe({
      next: (response) => {
        if (response.success) this.branches = response.data;
      }
    });
  }

  create(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.customerIdNumber || !this.form.branchId) return;

    this.loading = true;
    this.appointmentService.create(this.form).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.createdAppointment = response.data;
          this.successMessage = response.message;
          this.startTimer();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al agendar el turno.';
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.createdAppointment.remainingSeconds > 0) {
        this.createdAppointment.remainingSeconds--;
        const mins = Math.floor(this.createdAppointment.remainingSeconds / 60);
        const secs = this.createdAppointment.remainingSeconds % 60;
        this.remainingTime = `${mins}:${secs.toString().padStart(2, '0')}`;
      } else {
        clearInterval(this.timerInterval);
        this.remainingTime = 'Expirado';
      }
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}