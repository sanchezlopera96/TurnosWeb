import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../../core/services/branch.service';
import { Branch } from '../../../core/models/branch.model';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Sucursales</h2>
        <button class="btn btn-primary" (click)="showForm = true" *ngIf="!showForm">
          + Nueva Sucursal
        </button>
      </div>

      <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="alert alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <!-- Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>{{ editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal' }}</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" [(ngModel)]="form.name" placeholder="Nombre de la sucursal"
            [class.error]="submitted && !form.name"/>
          <span class="error-msg" *ngIf="submitted && !form.name">El nombre es requerido</span>
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input type="text" [(ngModel)]="form.address" placeholder="Dirección"
            [class.error]="submitted && !form.address"/>
          <span class="error-msg" *ngIf="submitted && !form.address">La dirección es requerida</span>
        </div>
        <div class="form-group">
          <label>Ciudad</label>
          <input type="text" [(ngModel)]="form.city" placeholder="Ciudad"
            [class.error]="submitted && !form.city"/>
          <span class="error-msg" *ngIf="submitted && !form.city">La ciudad es requerida</span>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" (click)="save()" [disabled]="loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <button class="btn btn-secondary" (click)="cancelForm()">Cancelar</button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading && !showForm">
        <div class="spinner"></div>
        <p>Cargando sucursales...</p>
      </div>

      <!-- Table -->
      <div class="card table-card" *ngIf="!loading && branches.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let branch of branches">
              <td><strong>{{ branch.name }}</strong></td>
              <td>{{ branch.address }}</td>
              <td>{{ branch.city }}</td>
              <td>
                <span [class]="branch.isActive ? 'badge badge-active' : 'badge badge-cancelled'">
                  {{ branch.isActive ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="edit(branch)">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div class="card empty-state" *ngIf="!loading && branches.length === 0 && !showForm">
        <span>🏢</span>
        <p>No hay sucursales registradas</p>
        <button class="btn btn-primary" (click)="showForm = true">
          Crear primera sucursal
        </button>
      </div>

    </div>
  `,
  styles: [`
    .form-card {
      max-width: 500px;
      margin-bottom: 24px;

      h3 {
        color: #272673;
        margin-bottom: 20px;
        font-size: 16px;
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

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

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }
  `]
})
export class BranchListComponent implements OnInit {
  branches: Branch[] = [];
  loading = false;
  showForm = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  editingBranch: Branch | null = null;

  form = { name: '', address: '', city: '' };

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    this.branchService.getAll().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) this.branches = response.data;
      },
      error: () => { this.loading = false; }
    });
  }

  edit(branch: Branch): void {
    this.editingBranch = branch;
    this.form = { name: branch.name, address: branch.address, city: branch.city };
    this.showForm = true;
  }

  save(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.name || !this.form.address || !this.form.city) return;

    this.loading = true;

    const request = this.editingBranch
      ? this.branchService.update(this.editingBranch.id, this.form)
      : this.branchService.create(this.form);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = this.editingBranch
            ? 'Sucursal actualizada exitosamente.'
            : 'Sucursal creada exitosamente.';
          this.cancelForm();
          this.loadBranches();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al guardar la sucursal.';
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.submitted = false;
    this.editingBranch = null;
    this.form = { name: '', address: '', city: '' };
  }
}