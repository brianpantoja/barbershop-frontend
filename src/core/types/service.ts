export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive?: boolean;
}

export type UpdateServiceDto = Partial<CreateServiceDto>;
