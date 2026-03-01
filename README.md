# TurnosWeb — Frontend Angular del Sistema de Agendamiento de Turnos

## Descripción

Aplicación web desarrollada en Angular para el agendamiento de turnos bancarios.
Consume la API REST [TurnosAPI](https://github.com/tu-usuario/TurnosAPI).

## Tecnologías

- Angular 21.2.0
- TypeScript 5.9.3
- Node.js 22.12.0
- SCSS
- JWT Authentication
- Vitest 4.0.18

## Arquitectura
```
src/app/
├── core/
│   ├── models/        ← Interfaces y tipos
│   ├── services/      ← Servicios HTTP
│   ├── interceptors/  ← Interceptor JWT
│   └── guards/        ← Guards de autenticación
├── features/
│   ├── auth/          ← Login (admin y cliente)
│   ├── appointments/  ← Agendar y listar turnos
│   └── branches/      ← Gestión de sucursales
└── shared/
    └── components/    ← Componentes reutilizables
```

## Requisitos Previos

- Node.js 22+
- Angular CLI 21+
- [TurnosAPI](https://github.com/tu-usuario/TurnosAPI) corriendo en `https://localhost:7047`

## Configuración y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/TurnosWeb.git
cd TurnosWeb
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la URL de la API

Edita `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7047/api'
};
```

### 4. Ejecutar la aplicación
```bash
ng serve
```

Aplicación disponible en: `http://localhost:4200`

### 5. Ejecutar pruebas
```bash
ng test
```

## Funcionalidades

### Cliente
- Autenticación con número de cédula
- Agendar turno seleccionando sucursal
- Ver countdown de 15 minutos para activar el turno
- Listar sus turnos con estado en tiempo real
- Activar turno en sucursal
- Cancelar turno

### Administrador
- Autenticación con usuario y contraseña
- Ver todos los turnos del sistema
- Marcar turnos como atendidos
- Cancelar turnos
- Crear y editar sucursales

## Roles y Acceso

| Funcionalidad | Cliente | Administrador |
|---------------|---------|---------------|
| Login | Cédula | Usuario + Contraseña |
| Agendar turno | ✅ | ❌ |
| Ver mis turnos | ✅ | ❌ |
| Activar turno | ✅ | ❌ |
| Ver todos los turnos | ❌ | ✅ |
| Marcar como atendido | ❌ | ✅ |
| Gestionar sucursales | ❌ | ✅ |

## Reglas de Negocio

- Los turnos expiran a los **15 minutos** si no son activados
- Máximo **5 turnos por cliente por día**
- El cliente ve un contador regresivo al agendar su turno

## Colores Corporativos

| Color | Hex |
|-------|-----|
| Azul principal | `#272673` |
| Azul marino | `#1a2047` |
| Blanco | `#ffffff` |