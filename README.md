# miTurno - Frontend

Aplicación frontend para el sistema de reserva de citas de barberías. Construido con Next.js, TailwindCSS y Zustand.

##  Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Estilos:** TailwindCSS
- **Estado:** Zustand
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React
- **HTTP:** Axios

## 📦 Instalación local

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/barbershop-frontend.git
cd barbershop-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Ejecutar en desarrollo
npm run dev

## 🐳 Docker
# Levantar con Docker (desde el repositorio del backend)
docker-compose up -d

## 📁 Estructura del proyecto
src/
├── app/                 # Páginas de Next.js (App Router)
│   ├── (auth)/          # Rutas públicas (login, register)
│   └── (dashboard)/     # Rutas protegidas (cliente, negocio)
├── core/                # Lógica de negocio
│   ├── api/             # Configuración de Axios
│   ├── repositories/    # Llamadas a la API
│   ├── services/        # Servicios
│   ├── types/           # Tipos TypeScript
│   └── usecases/        # Casos de uso
├── shared/              # Componentes y utilidades
│   ├── components/      # Componentes reutilizables
│   ├── forms/           # Formularios (login, register)
│   ├── hooks/           # Hooks personalizados
│   └── utils/           # Funciones auxiliares
├── storage/             # Zustand stores
├── schemas/             # Validaciones Zod
└── proxy.ts             # Autenticación en rutas (antes middleware)


## 🎯 Funcionalidades

### 👤 Cliente
- Ver servicios disponibles de la barbería
- Reservar citas con selector de fecha y hora
- Ver historial de citas
- Cancelar citas pendientes
- Recibir confirmación por email

### 🏢 Negocio
- Gestionar servicios (CRUD)
- Configurar horarios de atención (días y horas)
- Ver todas las citas recibidas
- Confirmar, completar o cancelar citas
- Dashboard con estadísticas
- Recibir notificaciones por email
