import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { BranchService } from '../../../core/services/branch.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Branch } from '../../../core/models/branch.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  branches: Branch[] = [];
  selectedBranchId = '';
  selectedStatus = '';
  todayOnly = true;
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private branchService: BranchService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    if (this.isAdmin) this.loadBranches();
    this.loadAppointments();
  }

  loadBranches(): void {
    this.branchService.getAll().subscribe({
      next: (response) => {
        if (response.success) this.branches = response.data;
        this.cdr.detectChanges();
      }
    });
  }

  loadAppointments(): void {
    this.loading = true;
    const request = this.isAdmin
      ? this.appointmentService.getAll(
          this.selectedBranchId || undefined,
          this.selectedStatus || undefined,
          this.todayOnly)
      : this.appointmentService.getMyAppointments();

    request.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.appointments = response.data;
          if (!this.isAdmin && this.appointments.length === 0) {
            this.router.navigate(['/appointments/create']);
          }
        } else {
          this.errorMessage = response.message;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los turnos.';
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al activar el turno.';
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(appointment: Appointment, status: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.appointmentService.updateStatus(appointment.id, { status }).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = status === 'Attended' ? 'Turno marcado como atendido.' : 'Turno cancelado.';
          this.loadAppointments();
        } else {
          this.errorMessage = response.message;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al actualizar el turno.';
        this.cdr.detectChanges();
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