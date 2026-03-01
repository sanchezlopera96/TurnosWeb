export interface Appointment {
  id: string;
  code: string;
  customerIdNumber: string;
  branchId: string;
  branchName: string;
  status: AppointmentStatus;
  createdAt: Date;
  expiresAt: Date;
  activatedAt?: Date;
  attendedAt?: Date;
  remainingSeconds: number;
}

export type AppointmentStatus =
  | 'Pending'
  | 'Active'
  | 'Expired'
  | 'Attended'
  | 'Cancelled';

export interface CreateAppointmentRequest {
  customerIdNumber: string;
  branchId: string;
}

export interface UpdateAppointmentStatusRequest {
  status: string;
}