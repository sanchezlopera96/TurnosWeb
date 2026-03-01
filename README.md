# TurnosWeb — Frontend Angular del Sistema de Agendamiento de Turnos

## Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Angular | 21.2.0 | Framework principal |
| TypeScript | 5.9.3 | Lenguaje de programación |
| Node.js | 22.12.0 | Entorno de ejecución |
| Angular CLI | 21.2.0 | Herramienta de desarrollo |
| RxJS | 7.8.2 | Programación reactiva |
| SCSS | — | Estilos |
| Vitest | 4.0.18 | Framework de pruebas |
| HttpClient | 21.2.0 | Peticiones HTTP |
| Angular Router | 21.2.0 | Navegación |
| Angular Forms | 21.2.0 | Formularios reactivos |

## Requisitos Previos

- [Node.js 22+](https://nodejs.org/)
- [Angular CLI 21+](https://angular.dev/tools/cli)
- [TurnosAPI](https://github.com/tu-usuario/TurnosAPI) corriendo en `http://localhost:7047`

## Pasos para Ejecutar

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

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5005/api'
};
```

### 4. Ejecutar la aplicación

```bash
ng serve
```

Aplicación disponible en: `http://localhost:4200`

### 5. Ejecutar las pruebas

```bash
ng test
```

## Usuarios de Prueba

| Tipo | Credencial | Contraseña |
|------|-----------|------------|
| Administrador | `admin` | `AdminPass5955.*` |
| Cliente | `1111111111` | *(no requiere)* |
| Cliente | `2222222222` | *(no requiere)* |
| Cliente | `3333333333` | *(no requiere)* |

## Funcionalidades

### Cliente
- Autenticación con número de cédula
- Agendar turno seleccionando sucursal
- Countdown de 15 minutos para activar el turno
- Activar turno desde la pantalla de creación o desde la lista
- Cancelar turno
- Ver historial de turnos

### Administrador
- Autenticación con usuario y contraseña
- Ver todos los turnos del día con filtros por sucursal, estado y período
- Activar turnos
- Marcar turnos como atendidos
- Cancelar turnos
- Crear y editar sucursales

## Roles y Acceso

| Funcionalidad | Cliente | Administrador |
|---------------|---------|---------------|
| Login | Cédula | Usuario + Contraseña |
| Agendar turno | ✅ | ❌ |
| Ver mis turnos | ✅ | ❌ |
| Activar turno | ✅ | ✅ |
| Cancelar turno | ✅ | ✅ |
| Ver todos los turnos | ❌ | ✅ |
| Filtrar por sucursal/estado | ❌ | ✅ |
| Marcar como atendido | ❌ | ✅ |
| Gestionar sucursales | ❌ | ✅ |

## Arquitectura

```
src/app/
├── core/
│   ├── models/              ← Interfaces TypeScript (espejo de DTOs del backend)
│   │   ├── appointment.model.ts
│   │   ├── branch.model.ts
│   │   ├── auth.model.ts
│   │   └── api-response.model.ts
│   ├── services/            ← Servicios HTTP
│   │   ├── auth.service.ts
│   │   ├── appointment.service.ts
│   │   └── branch.service.ts  (con caché en memoria)
│   ├── interceptors/        ← Interceptor JWT automático
│   │   └── auth.interceptor.ts
│   └── guards/              ← Guards de autenticación y rol
│       └── auth.guard.ts
├── features/
│   ├── auth/
│   │   └── login/           ← Login con tabs Admin/Cliente
│   ├── appointments/
│   │   ├── list/            ← Lista de turnos con filtros
│   │   └── create/          ← Crear turno con countdown
│   └── branches/
│       └── branch-list/     ← Gestión de sucursales
└── shared/
    └── components/
        └── unauthorized/    ← Página de acceso no autorizado
```

## Colores Corporativos

| Color | Hex |
|-------|-----|
| Azul principal | `#272673` |
| Azul marino | `#1a2047` |
| Blanco | `#ffffff` |

## Pruebas Unitarias

**Total: 21 pruebas**

| Archivo | Pruebas |
|---------|---------|
| `auth.service.spec.ts` | 9 pruebas |
| `appointment.service.spec.ts` | 7 pruebas |
| `auth.guard.spec.ts` | 5 pruebas |