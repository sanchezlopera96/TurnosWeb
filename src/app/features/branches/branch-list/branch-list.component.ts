import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../../core/services/branch.service';
import { Branch } from '../../../core/models/branch.model';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
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