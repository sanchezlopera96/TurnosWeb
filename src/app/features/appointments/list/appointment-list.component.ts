import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>{{ isAdmin ? 'Todos los Turnos' : 'Mis Turnos' }}</h2>
        <button class="btn btn-primary" (click)="newAppointment()" *ngIf="!isAdmin">
          + Agendar Turno
        </button>
      </div>

      <div class="alert alert-error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando turnos...</p>
      </div>

      <!-- Empty -->
      <div class="card empty-state" *ngIf="!loading && appointments.length === 0">
        <span>📋</span>
        <p>No hay turnos disponibles</p>
        <button class="btn btn-primary" (click)="newAppointment()" *ngIf="!isAdmin">
          Agendar mi primer turno
        </button>
      </div>

      <!-- Table -->
      <div class="card table-card" *ngIf="!loading && appointments.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th *ngIf="isAdmin">Cédula</th>
              <th>Sucursal</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Expira</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let appointment of appointments">
              <td><strong class="code">{{ appointment.code }}</strong></td>
              <td *ngIf="isAdmin">{{ appointment.customerIdNumber }}</td>
              <td>{{ appointment.branchName }}</td>
              <td>
                <span [class]="'badge badge-' + appointment.status.toLowerCase()">
                  {{ getStatusLabel(appointment.status) }}
                </span>
              </td>
              <td>{{ appointment.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ appointment.expiresAt | date:'HH:mm' }}</td>
              <td class="actions">
                <button
                  class="btn btn-primary btn-sm"
                  *ngIf="!isAdmin && appointment.status === 'Pending'"
                  (click)="activate(appointment)">
                  Activar
                </button>
                <button
                  class="btn btn-success btn-sm"
                  *ngIf="isAdmin && appointment.status === 'Active'"
                  (click)="updateStatus(appointment, 'Attended')">
                  Atendido
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  *ngIf="appointment.status === 'Pending' || appointment.status === 'Active'"
                  (click)="updateStatus(appointment, 'Cancelled')">
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      gap: 16px;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e8eaf0;
      border-top-color: #272673;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      padding: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      span { font-size: 48px; }
      p { color: #6b7280; font-size: 16px; }
    }

    .table-card { padding: 0; overflow: hidden; }

    .code {
      color: #272673;
      letter-spacing: 1px;
      font-size: 15px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    const request = this.isAdmin
      ? this.appointmentService.getAll()
      : this.appointmentService.getMyAppointments();

    request.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) this.appointments = response.data;
        else this.errorMessage = response.message;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los turnos.';
      }
    });
  }

  activate(appointment: Appointment): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.appointmentService.activate(appointment.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Turno activado exitosamente.';
          this.loadAppointments();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Error al activar el turno.';
      }
    });
  }

  updateStatus(appointment: Appointment, status: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.appointmentService.updateStatus(appointment.id, { status }).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Turno actualizado a ${status}.`;
          this.loadAppointments();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el turno.';
      }
    });
  }

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

  newAppointment(): void {
    this.router.navigate(['/appointments/create']);
  }
}