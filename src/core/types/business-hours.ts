export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES: Record<WeekDay, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export interface BusinessHours {
  id: string;
  businessId: string;
  dayOfWeek: WeekDay;
  dayName: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessHoursDto {
  dayOfWeek: WeekDay;
  openTime: string;
  closeTime: string;
  isOpen?: boolean;
}

export type UpdateBusinessHoursDto = Partial<CreateBusinessHoursDto>;
