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
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.scss'
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