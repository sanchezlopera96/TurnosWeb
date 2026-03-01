import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../models/branch.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private readonly apiUrl = `${environment.apiUrl}/branches`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<Branch>> {
    return this.http.get<ApiResponse<Branch>>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateBranchRequest): Observable<ApiResponse<Branch>> {
    return this.http.post<ApiResponse<Branch>>(this.apiUrl, request);
  }

  update(id: string, request: UpdateBranchRequest): Observable<ApiResponse<Branch>> {
    return this.http.put<ApiResponse<Branch>>(`${this.apiUrl}/${id}`, request);
  }
}