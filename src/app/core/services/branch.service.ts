import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../models/branch.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private readonly apiUrl = `${environment.apiUrl}/branches`;
  private cachedBranches: Branch[] | null = null;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Branch[]>> {
    if (this.cachedBranches) {
      return of({ success: true, message: 'Success', data: this.cachedBranches });
    }
    return this.http.get<ApiResponse<Branch[]>>(this.apiUrl).pipe(
      tap(response => {
        if (response.success) {
          this.cachedBranches = response.data;
        }
      })
    );
  }

  getById(id: string): Observable<ApiResponse<Branch>> {
    return this.http.get<ApiResponse<Branch>>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateBranchRequest): Observable<ApiResponse<Branch>> {
    this.cachedBranches = null;
    return this.http.post<ApiResponse<Branch>>(this.apiUrl, request);
  }

  update(id: string, request: UpdateBranchRequest): Observable<ApiResponse<Branch>> {
    this.cachedBranches = null;
    return this.http.put<ApiResponse<Branch>>(`${this.apiUrl}/${id}`, request);
  }
}