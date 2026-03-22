export const formatTimeToAMPM = (time: string): string => {

  const [hours, minutes] = time.split(":").map(Number);

  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const formatDateToSpanish = (dateStr: string): string => {
  // NO crear nuevo Date, usar el string directamente
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Crear fecha en UTC para evitar desfase
  const date = new Date(Date.UTC(year, month - 1, day));
  
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Forzar UTC
  });
};

