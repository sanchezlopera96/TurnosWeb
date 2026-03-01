export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  isActive: boolean;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
}

export interface UpdateBranchRequest {
  name: string;
  address: string;
  city: string;
}