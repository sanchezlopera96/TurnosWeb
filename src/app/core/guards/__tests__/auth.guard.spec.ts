import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      getRole: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is authenticated and no role required', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getRole.mockReturnValue('Client');

    const route = { data: {} } as ActivatedRouteSnapshot;
    const result = guard.canActivate(route);

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const route = { data: {} } as ActivatedRouteSnapshot;
    const result = guard.canActivate(route);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should return true when user has required role', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getRole.mockReturnValue('Admin');

    const route = { data: { role: 'Admin' } } as any;
    const result = guard.canActivate(route);

    expect(result).toBe(true);
  });

  it('should redirect to unauthorized when user does not have required role', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getRole.mockReturnValue('Client');

    const route = { data: { role: 'Admin' } } as any;
    const result = guard.canActivate(route);

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});