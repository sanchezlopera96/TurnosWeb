import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AuthResponse } from '../../models/auth.model';
import { ApiResponse } from '../../models/api-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: ApiResponse<AuthResponse> = {
    success: true,
    message: 'Login successful.',
    data: {
      token: 'mock-jwt-token',
      role: 'Client',
      identifier: '123456789',
      expiresAt: new Date()
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clientLogin should save token to localStorage on success', () => {
    service.clientLogin({ idNumber: '123456789' }).subscribe(response => {
      expect(response.success).toBe(true);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('role')).toBe('Client');
      expect(localStorage.getItem('identifier')).toBe('123456789');
    });

    const req = httpMock.expectOne(req => req.url.includes('login-client'));
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);
  });

  it('adminLogin should save token to localStorage on success', () => {
    const adminResponse: ApiResponse<AuthResponse> = {
      ...mockAuthResponse,
      data: { ...mockAuthResponse.data, role: 'Admin', identifier: 'admin' }
    };

    service.adminLogin({ username: 'admin', password: '1234' }).subscribe(response => {
      expect(response.success).toBe(true);
      expect(localStorage.getItem('role')).toBe('Admin');
    });

    const req = httpMock.expectOne(req => req.url.includes('login-admin'));
    expect(req.request.method).toBe('POST');
    req.flush(adminResponse);
  });

  it('logout should clear localStorage', () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', 'Client');
    localStorage.setItem('identifier', '123456789');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('identifier')).toBeNull();
  });

  it('isAuthenticated should return true when token exists', () => {
    localStorage.setItem('token', 'mock-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated should return false when token does not exist', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAdmin should return true when role is Admin', () => {
    localStorage.setItem('role', 'Admin');
    expect(service.isAdmin()).toBe(true);
  });

  it('isClient should return true when role is Client', () => {
    localStorage.setItem('role', 'Client');
    expect(service.isClient()).toBe(true);
  });

  it('getToken should return token from localStorage', () => {
    localStorage.setItem('token', 'mock-token');
    expect(service.getToken()).toBe('mock-token');
  });
});