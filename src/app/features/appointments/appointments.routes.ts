import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/appointment-list.component').then(m => m.AppointmentListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/appointment-create.component').then(m => m.AppointmentCreateComponent),
    canActivate: [AuthGuard],
    data: { role: 'Client' }
  }
];