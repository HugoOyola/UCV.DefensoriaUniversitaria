# FrontEndPlantillaUCV

Plantilla base oficial para iniciar proyectos frontend con Angular, Tailwind y Angular Material.

Este README está diseñado para que un equipo pueda iniciar un proyecto nuevo sin bloqueos y con criterios claros de organización.

## 1. Objetivo de esta plantilla

- Estandarizar la arquitectura frontend para todos los proyectos.
- Separar claramente capas transversales y capas de negocio.
- Facilitar mantenimiento, escalabilidad y onboarding de nuevos desarrolladores.
- Centralizar la configuración de ambientes, endpoints y estilos globales.

## 2. Stack tecnológico

- Angular standalone (componentes sin NgModule por feature).
- Angular Router.
- Angular Material.
- TailwindCSS.
- SCSS para tema y estilos globales.
- ESLint para calidad de código.

## 3. Requisitos previos

- Node.js LTS (recomendado: versión compatible con Angular 21).
- npm.
- Angular CLI.

Comandos de referencia:

```bash
node -v
npm -v
npx ng version
```

## 4. Arranque rápido

1. Instalar dependencias:

```bash
npm install
```

2. Levantar ambiente de desarrollo:

```bash
npm run start
```

3. Verificar compilación:

```bash
npm run build
```

4. Validar calidad:

```bash
npm run lint
npm run test
```

## 5. Estructura general del proyecto

### 5.1 Raíz

- angular.json
	Configuración de build, serve, test, lint y fileReplacements de environments.

- package.json
	Dependencias y scripts oficiales del proyecto.

- tsconfig.json
	Configuración TypeScript global y alias de rutas:
	- @app/*
	- @assets/*
	- @auth/*
	- @shared/*
	- @interface/*
	- @core/*
	- @environment/*

- tailwind.config.js
	Configuración de Tailwind.

### 5.2 Carpeta src

- [src/main.ts](src/main.ts)
	Bootstrap de la aplicación.

- [src/styles.scss](src/styles.scss)
	Variables CSS, base global y capas Tailwind.

- [src/themes](src/themes)
	Tema visual global por componentes de UI.

- [src/assets](src/assets)
	Recursos estáticos (imágenes, logos, fuentes, svg).

- [src/environments](src/environments)
	Configuración de ambientes y endpoints.

- [src/app](src/app)
	Código fuente principal de la aplicación.

## 6. Arquitectura de src/app

### [src/app/app.config.ts](src/app/app.config.ts)

Aquí se registran proveedores globales:

- Router.
- HttpClient.
- Interceptores (token/interceptor).
- Animaciones.

### [src/app/app.routes.ts](src/app/app.routes.ts)

Define rutas raíz e hijas. Toda nueva pantalla navegable debe registrarse aquí.

### [src/app/core](src/app/core)

Contiene elementos transversales, no específicos de una feature.

- [src/app/core/auth](src/app/core/auth)
	Autenticación, token, cifrado, interceptor, utilidades relacionadas.

- [src/app/core/guard](src/app/core/guard)
	Guards de acceso a rutas.

- [src/app/core/interface](src/app/core/interface)
	Interfaces globales reutilizables.

- [src/app/core/shared](src/app/core/shared)
	Recursos compartidos transversales:
	- components: UI reutilizable global (sidebar, dialog, not-found, skeleton).
	- pipes: pipes reutilizables.
	- services: servicios compartidos por varias features.

### [src/app/page](src/app/page)

Capa de negocio por dominio/feature.

- Cada carpeta representa una pantalla o módulo funcional.
- Estructura recomendada por feature:
	- componente contenedor de pantalla.
	- components (subcomponentes de esa pantalla).
	- interface (tipos y contratos de esa feature).
	- services (lógica y peticiones HTTP de esa feature).

### [src/app/shared](src/app/shared)

Utilidades compartidas no necesariamente visuales.
Ejemplo: validadores o servicios utilitarios.

## 7. Dónde crear componentes, interfaces y servicios

### 7.1 Componentes

- Reutilizable global: [src/app/core/shared/components](src/app/core/shared/components)
- Reutilizable solo dentro de una feature: src/app/page/<feature>/components
- Pantalla principal de una feature: src/app/page/<feature>/<feature>.component.ts

### 7.2 Interfaces

- Globales: [src/app/core/interface](src/app/core/interface)
- De una feature: src/app/page/<feature>/interface

### 7.3 Services

- Compartidos entre múltiples features: [src/app/core/shared/services](src/app/core/shared/services)
- Solo de una feature: src/app/page/<feature>/services
- Seguridad/autenticación/interceptores: [src/app/core/auth](src/app/core/auth)

## 8. Guía de environments y endpoints (detallada)

Esta sección es clave para iniciar proyectos sin errores.

### 8.1 Archivos y responsabilidades

- [src/environments/environment.ts](src/environments/environment.ts)
	Ambiente de producción (base por convención).

- [src/environments/environment.development.ts](src/environments/environment.development.ts)
	Ambiente local/desarrollo.

- [src/environments/environment.qa.ts](src/environments/environment.qa.ts)
	Ambiente de QA.

- [src/environments/endpoints.ts](src/environments/endpoints.ts)
	Catálogo centralizado de APIs y endpoints por dominio.

### 8.2 Cómo se selecciona cada environment

En [angular.json](angular.json) se definen fileReplacements:

- build:development reemplaza environment.ts por environment.development.ts
- build:qa reemplaza environment.ts por environment.qa.ts

Para levantar local con configuración development:

```bash
npm run start
```

Para compilar QA:

```bash
npm run build:qa
```

### 8.3 Campos principales del objeto environment

Campos que suelen aparecer en esta plantilla:

- production: controla comportamiento de logs y optimizaciones.
- local: bandera de comportamiento local.
- configInterceptor:
	- MAXIMO_INTENTOS
	- TIEMPO_ESPERA_MS
- ip: endpoint para resolver IP pública.
- redireccion: URL de redirección principal.
- apiRefreshToken: URL para refresh de token.
- ls_apis y ls_apis1: agrupaciones de APIs con token y rutas.
- endpointGoogleDrive, apiKeyUser, apiKeyPass, apiTokenUrl, cDominio: parámetros de integración.

### 8.4 Estructura esperada de APIs

Dentro de ls_apis o ls_apis1 se maneja una estructura similar:

- proveedor API (ejemplo: trilceapi2)
	- token:
		- name
		- user
		- pass
		- tokenUrl
	- routes:
		- dominio API (por ejemplo TrilcePrincipalApi, IncidenciaApi)
		- url base
		- endpoints

### 8.5 Cómo agregar un nuevo dominio API

Paso 1. Agregar dominio en [src/environments/endpoints.ts](src/environments/endpoints.ts)

- Crear objeto con url y endpoints.

Paso 2. Exponer ese dominio dentro de routes del provider en cada environment

- environment.development.ts
- environment.qa.ts
- environment.ts

Paso 3. Consumir desde servicio de feature

- Crear service en src/app/page/<feature>/services.
- Tomar base URL y endpoint desde environment para evitar strings duplicados.

Paso 4. Verificar compilaciones

- npm run build
- npm run build:qa

### 8.6 Buenas prácticas obligatorias en environments

- No duplicar URLs en servicios; centralizar en endpoints.ts + environment.
- Mantener misma estructura de claves entre development, qa y production.
- Si una clave existe en development debe existir también en qa y production.
- Si cambias nombres de campos, actualizar interceptor y servicios que los consumen.

### 8.7 Riesgo de seguridad importante

Actualmente existen credenciales y llaves visibles en archivos environment.
Para proyectos productivos se recomienda:

- No exponer secretos reales en frontend.
- Mover credenciales a backend o servicio de configuración seguro.
- Usar llaves de corta vida y rotación periódica.

## 9. Paso a paso completo para iniciar una nueva feature

Ejemplo: feature alumnos.

### Paso 1. Crear carpeta de dominio

- src/app/page/alumnos

### Paso 2. Generar componente contenedor

```bash
ng g c page/alumnos
```

### Paso 3. Crear subcomponentes

```bash
ng g c page/alumnos/components/filtro-alumnos
ng g c page/alumnos/components/lista-alumnos
```

### Paso 4. Crear interfaces de la feature

- src/app/page/alumnos/interface/alumno.interface.ts
- src/app/page/alumnos/interface/filtro-alumno.interface.ts

### Paso 5. Crear servicio de feature

```bash
ng g s page/alumnos/services/alumnos
```

### Paso 6. Registrar ruta

Agregar ruta en [src/app/app.routes.ts](src/app/app.routes.ts).

### Paso 7. Integrar en menú lateral (si aplica)

Actualizar configuración de menú en [src/app/page/main/sidebar.ts](src/app/page/main/sidebar.ts).

### Paso 8. Conectar datos

- Componente contenedor llama al service.
- Service usa environment y endpoints.
- Template consume señales/estado del contenedor.

### Paso 9. Aplicar estilos

- Estilo local en el componente.
- Reglas globales únicamente cuando aplique a toda la app.

### Paso 10. Validaciones finales

```bash
npm run lint
npm run test
npm run build
npm run build:qa
```

## 10. Flujo recomendado de desarrollo

1. Definir contratos (interfaces).
2. Implementar servicio de datos.
3. Implementar componente contenedor.
4. Implementar componentes hijos de presentación.
5. Registrar ruta y menú.
6. Probar en development y compilar QA.

## 11. Convenciones de carpetas y nombres

- Nombres por dominio de negocio: alumnos, pagos, incidencias.
- Evitar nombres genéricos: modulo1, vista2, componenteA.
- Interfaces con sufijo .interface.ts.
- Servicios con sufijo .service.ts.
- Mantener una responsabilidad clara por archivo.

## 12. Scripts oficiales

- npm run start
	Servidor de desarrollo.

- npm run build
	Build producción.

- npm run build:qa
	Build QA.

- npm run watch
	Build incremental para desarrollo.

- npm run test
	Pruebas unitarias.

- npm run lint
	Análisis estático de código.

## 13. Troubleshooting de inicio

### Error de dependencias o lock file

1. Eliminar node_modules.
2. Ejecutar npm install.

### Error por claves faltantes en environment

1. Comparar estructura entre environment.development.ts, environment.qa.ts y environment.ts.
2. Asegurar mismas claves en los tres archivos.

### Error de rutas no encontradas

1. Revisar [src/app/app.routes.ts](src/app/app.routes.ts).
2. Revisar path definido en menú en [src/app/page/main/sidebar.ts](src/app/page/main/sidebar.ts).

### Error por imports largos o rotos

1. Usar alias de tsconfig.
2. Verificar rutas relativas y nombres de archivo.

## 14. Checklist final para crear un nuevo proyecto

1. Proyecto compila en development.
2. Proyecto compila en qa.
3. Endpoints y environments completos y consistentes.
4. Feature principal creada con estructura estándar.
5. Rutas registradas y menú actualizado.
6. Lint y test en verde.
7. README actualizado con cualquier ajuste de arquitectura.

---

Si esta plantilla es la base para todos los proyectos, este README debe considerarse documento vivo y actualizarse en cada cambio estructural.
