import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
            [value]="form.customerIdNumber"
            placeholder="Número de cédula"
            readonly
            style="background-color: #f5f6fa; cursor: not-allowed;"/>
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
            <span [class]="'badge badge-' + createdAppointment.status.toLowerCase()">
              {{ getStatusLabel(createdAppointment.status) }}
            </span>
          </div>
        </div>

        <div class="alert alert-success" *ngIf="actionSuccess">{{ actionSuccess }}</div>
        <div class="alert alert-error" *ngIf="actionError">{{ actionError }}</div>

        <div class="result-actions" *ngIf="createdAppointment.status === 'Pending'">
          <button class="btn btn-primary" (click)="activateAppointment()" [disabled]="actionLoading">
            {{ actionLoading ? 'Activando...' : '✔ Activar Turno' }}
          </button>
          <button class="btn btn-danger" (click)="cancelAppointment()" [disabled]="actionLoading">
            {{ actionLoading ? 'Cancelando...' : '✖ Cancelar Turno' }}
          </button>
        </div>

        <div class="result-actions" *ngIf="createdAppointment.status === 'Active'">
          <span class="badge badge-active">Turno Activo ✔</span>
          <button class="btn btn-danger" (click)="cancelAppointment()" [disabled]="actionLoading">
            {{ actionLoading ? 'Cancelando...' : '✖ Cancelar Turno' }}
          </button>
        </div>

        <div class="result-actions" *ngIf="createdAppointment.status === 'Cancelled'">
          <span class="badge badge-cancelled">Turno Cancelado</span>
        </div>

        <div class="result-actions" *ngIf="remainingTime === 'Expirado'">
          <span class="badge badge-expired">Turno Expirado</span>
          <button class="btn btn-primary" (click)="newAppointment()">Agendar Nuevo Turno</button>
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
    
    .result-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      align-items: center;
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form.customerIdNumber = this.authService.getIdentifier() || '';
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.branches = response.data;
          this.cdr.detectChanges();
        }
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
          const mins = Math.floor(this.createdAppointment.remainingSeconds / 60);
          const secs = this.createdAppointment.remainingSeconds % 60;
          this.remainingTime = `${mins}:${secs.toString().padStart(2, '0')}`;
          this.startTimer();
        } else {
          this.errorMessage = response.message;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error al agendar el turno.';
        this.cdr.detectChanges();
      }
    });
  }

  startTimer(): void {
    let seconds = this.createdAppointment.remainingSeconds;
    
    this.timerInterval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.remainingTime = `${mins}:${secs.toString().padStart(2, '0')}`;
      } else {
        this.remainingTime = 'Expirado';
        clearInterval(this.timerInterval);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  actionLoading = false;
  actionSuccess = '';
  actionError = '';

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Pending': 'Pendiente',
      'Active': 'Activo',
      'Expired': 'Expirado',
      'Attended': 'Atendido',
      'Cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  activateAppointment(): void {
    this.actionLoading = true;
    this.actionSuccess = '';
    this.actionError = '';
    this.appointmentService.activate(this.createdAppointment.id).subscribe({
      next: (response) => {
        this.actionLoading = false;
        if (response.success) {
          this.createdAppointment = response.data;
          this.actionSuccess = 'Turno activado exitosamente.';
          clearInterval(this.timerInterval);
        } else {
          this.actionError = response.message;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actionLoading = false;
        this.actionError = err?.error?.message || 'Error al activar el turno.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelAppointment(): void {
    this.actionLoading = true;
    this.actionSuccess = '';
    this.actionError = '';
    this.appointmentService.updateStatus(this.createdAppointment.id, { status: 'Cancelled' }).subscribe({
      next: (response) => {
        this.actionLoading = false;
        if (response.success) {
          this.createdAppointment = response.data;
          this.actionSuccess = 'Turno cancelado.';
          clearInterval(this.timerInterval);
        } else {
          this.actionError = response.message;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actionLoading = false;
        this.actionError = err?.error?.message || 'Error al cancelar el turno.';
        this.cdr.detectChanges();
      }
    });
  }

  newAppointment(): void {
    this.createdAppointment = null;
    this.form = { customerIdNumber: this.authService.getIdentifier() || '', branchId: '' };
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    clearInterval(this.timerInterval);
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}