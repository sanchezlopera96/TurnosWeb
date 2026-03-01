import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../../models/appointment.model';
import { ApiResponse } from '../../models/api-response.model';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  const mockAppointment: Appointment = {
    id: '1',
    code: 'T123456789',
    customerIdNumber: '123456789',
    branchId: 'branch-1',
    branchName: 'Sucursal Principal',
    status: 'Pending',
    createdAt: new Date(),
    expiresAt: new Date(),
    remainingSeconds: 900
  };

  const mockResponse: ApiResponse<Appointment> = {
    success: true,
    message: 'Success',
    data: mockAppointment
  };

  const mockListResponse: ApiResponse<Appointment[]> = {
    success: true,
    message: 'Success',
    data: [mockAppointment]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create should POST to appointments endpoint', () => {
    service.create({ customerIdNumber: '123456789', branchId: 'branch-1' }).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.code).toBe('T123456789');
    });

    const req = httpMock.expectOne(req => req.url.includes('appointments') && req.method === 'POST');
    expect(req.request.body).toEqual({ customerIdNumber: '123456789', branchId: 'branch-1' });
    req.flush(mockResponse);
  });

  it('getAll should GET all appointments', () => {
    service.getAll().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.includes('appointments') && req.method === 'GET');
    req.flush(mockListResponse);
  });

  it('getMyAppointments should GET my-appointments endpoint', () => {
    service.getMyAppointments().subscribe(response => {
      expect(response.data.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.includes('my-appointments'));
    expect(req.request.method).toBe('GET');
    req.flush(mockListResponse);
  });

  it('activate should PUT to activate endpoint', () => {
    service.activate('1').subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(req => req.url.includes('activate'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('updateStatus should PUT to status endpoint', () => {
    service.updateStatus('1', { status: 'Attended' }).subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(req => req.url.includes('status'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'Attended' });
    req.flush(mockResponse);
  });

  it('getById should GET appointment by id', () => {
    service.getById('1').subscribe(response => {
      expect(response.data.id).toBe('1');
    });

    const req = httpMock.expectOne(req => req.url.includes('appointments/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});