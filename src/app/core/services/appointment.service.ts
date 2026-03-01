import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentStatusRequest } from '../models/appointment.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  create(request: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.apiUrl, request);
  }

  getAll(branchId?: string, status?: string, todayOnly: boolean = true): Observable<ApiResponse<Appointment[]>> {
    let url = `${this.apiUrl}?todayOnly=${todayOnly}`;
    if (branchId) url += `&branchId=${branchId}`;
    if (status) url += `&status=${status}`;
    return this.http.get<ApiResponse<Appointment[]>>(url);
  }

  getById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`);
  }

  getMyAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/my-appointments`);
  }

  activate(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/${id}/activate`, {});
  }

  updateStatus(id: string, request: UpdateAppointmentStatusRequest): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/${id}/status`, request);
  }
}