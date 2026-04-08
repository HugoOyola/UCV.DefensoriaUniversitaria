# Guia Estandar Angular: Component + Service + Interface + inject

Este documento define un flujo reutilizable para construir modulos de negocio en Angular con una estructura limpia, escalable y consistente.

La guia esta basada en el patron que ya usas en Libro de Reclamos (Monitoreo) y esta pensada para replicarse en todos tus proyectos.

## 1. Objetivo

Estandarizar siempre el mismo proceso:

1. Crear interfaces (contratos de datos).
2. Definir endpoints en environments.
3. Crear service de la feature.
4. Crear componente contenedor (orquestador).
5. Crear componente de presentacion (tabla/listado).
6. Compartir estado entre componentes.
7. Conectar acciones UI con backend.

## 2. Para que sirve inject

`inject()` es una API de Angular para resolver dependencias desde el inyector sin usar parametros en el constructor.

Ventajas practicas:

1. Constructor mas limpio y enfocado en inicializacion.
2. Mejor legibilidad en componentes standalone.
3. Consistencia con `signal`, `computed` y `effect`.
4. Facil inyeccion en guards/interceptors funcionales.

Ejemplo:

```ts
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MonitoreoService } from './services/monitoreo.service';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  template: ''
})
export class MonitoreoComponent {
  public toastr = inject(ToastrService);
  public monitoreoService = inject(MonitoreoService);
}
```

## 3. Estructura recomendada de carpetas

Usa una estructura por feature y por responsabilidad:

```txt
src/app/page/quality/Services/LibroReclamos/
  pages/
    monitoreoreclamos/
      components/
        monitoreo/
          components/
            listadoreclamo/
          services/
            monitoreo.service.ts
          monitoreo.component.ts
  interface/
    libro.interface.ts
  shared/
    services/
      global-shared.service.ts
```

### Estructura base recomendada para cualquier feature

La idea es que cada modulo de negocio tenga siempre el mismo orden interno. Eso reduce tiempo de desarrollo, facilita ubicacion de archivos y evita mezclar responsabilidades.

```txt
src/
  app/
    core/
      auth/
      guard/
      interface/
      shared/
        components/
        pipes/
        services/

    page/
      modulo-o-dominio/
        Services/
          NombreFeature/
            interface/
              nombre-feature.interface.ts
            shared/
              services/
                nombre-feature-shared.service.ts
            pages/
              nombre-feature/
                services/
                  nombre-feature.service.ts
                components/
                  listado/
                    listado.component.ts
                    listado.component.html
                    listado.component.scss
                  filtro/
                    filtro.component.ts
                    filtro.component.html
                    filtro.component.scss
                  modal-detalle/
                    modal-detalle.component.ts
                    modal-detalle.component.html
                    modal-detalle.component.scss
                nombre-feature.component.ts
                nombre-feature.component.html
                nombre-feature.component.scss
                nombre-feature.routes.ts

    environments/
      environment.ts
      endpoints.ts
```

### Que debe ir en cada carpeta

`core/`

1. Servicios globales de autenticacion.
2. interceptors.
3. guards.
4. utilidades realmente transversales a todo el sistema.

`page/`

1. Pantallas funcionales del sistema.
2. Features separadas por dominio o modulo.

`interface/` dentro de una feature

1. Contratos del backend.
2. Modelos de request.
3. Modelos de response.
4. Tipos de datos de negocio.

`shared/` dentro de una feature

1. Estado compartido solo de esa feature.
2. Datos que se usan entre padre, hijos y modales.
3. signals, computed o datos cacheados de la pantalla.

`pages/nombre-feature/services/`

1. Llamadas HTTP de la pantalla.
2. Mapeos simples de respuesta si son propios de esa feature.

`pages/nombre-feature/components/`

1. Componentes hijos reutilizados dentro de la feature.
2. Tabla.
3. Filtros.
4. Modales.
5. Secciones visuales.

### Reglas para mantener orden y limpieza

1. No mezclar interfaces dentro de componentes.
2. No poner llamadas HTTP en componentes si pueden vivir en un service.
3. No poner reglas de negocio complejas en el HTML.
4. No usar un `shared` global para datos que solo pertenecen a una pantalla.
5. Si algo solo vive en una feature, debe quedarse dentro de esa feature.
6. Si algo se usa en todo el proyecto, va en `core` o `app/shared` segun su responsabilidad.
7. Un archivo debe tener una responsabilidad clara.

### Estructura minima ideal por feature

Si la feature es pequena, como minimo deberia tener:

```txt
NombreFeature/
  interface/
    nombre-feature.interface.ts
  shared/
    services/
      nombre-feature-shared.service.ts
  pages/
    nombre-feature/
      services/
        nombre-feature.service.ts
      components/
        listado/
      nombre-feature.component.ts
      nombre-feature.component.html
      nombre-feature.component.scss
```

Si la feature crece, agregas subcomponentes, modales y rutas internas, pero sin romper este orden base.

## 4. Paso a paso completo

### Antes de escribir codigo: por donde empezar

El error mas comun es empezar por el HTML o por el componente principal sin tener claro el contrato de datos. El orden correcto para empezar es este:

1. Entender el requerimiento funcional.
2. Identificar que datos entran y que datos salen.
3. Diseñar interfaces.
4. Registrar endpoints.
5. Crear service.
6. Crear estado compartido si la feature lo necesita.
7. Crear componente contenedor.
8. Crear componentes hijos.
9. Conectar UI con service.
10. Validar flujo completo.

### Orden recomendado de trabajo en una nueva pantalla

#### Fase 1: Analisis

Antes de programar responde estas preguntas:

1. Que hace la pantalla.
2. Que filtros necesita.
3. Que lista o detalle muestra.
4. Que acciones ejecuta.
5. Que endpoints consume.
6. Que datos deben persistir entre componentes.

#### Fase 2: Contratos

Empieza siempre creando:

1. Interfaces de request.
2. Interfaces de response.
3. Tipos auxiliares de negocio.

Si no haces esto primero, lo normal es terminar con `any`, errores de nombres y payloads mal armados.

#### Fase 3: Integracion

Luego crea:

1. Endpoints en `environment`.
2. Service HTTP de la feature.

Con eso ya tienes resuelto el acceso al backend antes de tocar la UI.

#### Fase 4: Estado y orquestacion

Despues crea:

1. Shared service de feature si hay varios componentes.
2. Componente contenedor.
3. Formularios reactivos.

#### Fase 5: Presentacion

Finalmente crea:

1. Tabla/listado.
2. Modales.
3. Botones de accion.
4. Paginacion.
5. Mensajes visuales.

Este orden evita rehacer codigo cuando cambian nombres de campos o estructuras del backend.

### Paso 1: Crear interfaces (Request/Response)

Primero define contratos para evitar `any` y asegurar tipado en toda la cadena.

Ejemplo:

```ts
export interface ReclamoRequest {
  idReclamo: string;
  cpercodigo: string;
  cPerJuridica: string;
  dFechaInicio: string;
  dFechaFin: string;
  cTipoReclamo: string;
  cEstadoReclamo: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
  };
}

export interface DataReclamo {
  idreclamo: number;
  cRecNombre: string;
  cRecEstado: number;
  totalRows?: number;
}
```

Buenas practicas:

1. Nombres claros: `AlgoRequest`, `AlgoResponse`, `DataAlgo`.
2. Si backend cambia, actualiza primero interfaces.
3. No mezclar tipos de UI con tipos de API si representan cosas distintas.

### Paso 2: Definir endpoints en environment

Nunca hardcodees URLs en el componente.

Ejemplo de enfoque:

```ts
export const environment = {
  ls_apis: {
    LibroReclamos: {
      routes: {
        libroreclamos: {
          url: 'https://api.tudominio.com',
          endpoints: {
            Libro_Monitoreo: '/libro/monitoreo',
            Libro_EditaStatus: '/libro/estado'
          }
        }
      }
    }
  }
};
```

### Paso 3: Crear service de la feature

El service encapsula llamadas HTTP y deja al componente solo con logica de pantalla.

Ejemplo:

```ts
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private api = environment.ls_apis.LibroReclamos.routes.libroreclamos;

  postObtenerReclamos(data: ReclamoRequest): Observable<HttpResponse<any>> {
    const url = this.api.url + this.api.endpoints.Libro_Monitoreo;
    return this._http.post<any>(url, data, {
      headers: this.headers_a_json,
      observe: 'response'
    });
  }

  putActualizarEstado(data: IStatusRequest): Observable<HttpResponse<any>> {
    const url = this.api.url + this.api.endpoints.Libro_EditaStatus;
    return this._http.put<any>(url, data, {
      headers: this.headers_a_json,
      observe: 'response'
    });
  }
}
```

Reglas importantes:

1. Un metodo por endpoint.
2. Tipar request/response.
3. Centralizar cabeceras comunes.

### Paso 4: Crear componente contenedor (smart component)

Este componente:

1. Construye formularios.
2. Valida filtros.
3. Llama al service.
4. Guarda resultados en estado compartido.

Ejemplo:

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  templateUrl: './monitoreo.component.html'
})
export class MonitoreoComponent {
  private fb = inject(FormBuilder);
  private monitoreoService = inject(MonitoreoService);
  private globalShared = inject(GlobalSharedService);
  private toastr = inject(ToastrService);

  public form: FormGroup = this.fb.group({
    campus: ['', Validators.required],
    fecha: this.fb.group({
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required]
    }),
    tipoReclamo: ['2', Validators.required]
  });

  buscar(): void {
    if (this.form.invalid) {
      this.toastr.info('Completa filtros', 'Busqueda');
      return;
    }

    const data: ReclamoRequest = {
      idReclamo: '0',
      cpercodigo: this.globalShared.cPerCodigo(),
      cPerJuridica: this.form.get('campus')?.value ?? '',
      dFechaInicio: '',
      dFechaFin: '',
      cTipoReclamo: this.form.get('tipoReclamo')?.value ?? '',
      cEstadoReclamo: '0',
      pagination: { pageIndex: 1, pageSize: 10, totalRows: 0 }
    };

    this.monitoreoService.postObtenerReclamos(data).subscribe({
      next: (resp) => this.globalShared.datosBusqueda.set(resp.body?.lstItem ?? []),
      error: () => this.toastr.error('Error consultando reclamos', 'Error')
    });
  }
}
```

### Paso 5: Crear componente de presentacion (dumb component)

Este componente:

1. Muestra tabla/listado.
2. Maneja paginacion.
3. Dispara acciones por fila.

Ejemplo:

```ts
import { Component, Input, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listadoreclamo',
  standalone: true,
  templateUrl: './listadoreclamo.component.html'
})
export class ListadoreclamoComponent {
  private monitoreoService = inject(MonitoreoService);

  @Input() form!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['idreclamo', 'crecnombre', 'estadoreclamo'];
  dataSource = new MatTableDataSource<DataReclamo>([]);
  totalRows = 0;

  onPaginateChange(pageIndex: number, pageSize: number): void {
    // reconstruir request y volver a consultar
  }
}
```

### Paso 6: Compartir estado entre componentes

Si padre e hijo necesitan los mismos datos, usa un service compartido de feature.

Ejemplo de responsabilidades del shared service:

1. `datosBusqueda`.
2. `activeTab`.
3. `perfiles`.
4. `cPerCodigo`.

Con esto evitas pasar demasiados `@Input`/`@Output` y mantienes un unico estado fuente.

### Paso 7: Agregar acciones de negocio por fila

Ejemplo real de tu flujo:

1. Seleccionar nuevo estado en menu/radio.
2. Validar reglas de negocio antes de enviar.
3. Llamar `putActualizarEstado`.
4. Refrescar listado y notificar al usuario.

## 5. Flujo general de datos

```txt
UI (Formulario) -> Componente Contenedor -> Service -> API
API -> Service -> Estado Compartido -> Componente Listado (Tabla)
Accion en fila -> Service (PUT/POST) -> Refresco de Tabla
```

## 6. Checklist rapido para cada nueva feature

1. Crear carpeta de la feature.
2. Crear `interfaces` de request/response.
3. Registrar endpoints en `environment`.
4. Crear `feature.service.ts`.
5. Crear `feature.component.ts` (contenedor).
6. Crear `components/listado...` (presentacion).
7. Conectar con shared service si aplica.
8. Agregar validaciones y notificaciones.
9. Probar busqueda, paginacion y acciones.

## 7. Secuencia exacta sugerida para empezar una feature nueva

Si quieres un orden totalmente operativo y repetible, sigue siempre esta secuencia:

1. Crear la carpeta de la feature.
2. Crear el archivo de interfaces.
3. Crear o registrar endpoints en environment.
4. Crear el service HTTP.
5. Crear el shared service si hay estado comun.
6. Crear el componente principal standalone.
7. Crear el formulario reactivo.
8. Implementar la busqueda principal.
9. Crear el componente listado.
10. Implementar paginacion.
11. Implementar acciones por fila.
12. Crear modales si existen.
13. Agregar toastr y validaciones.
14. Probar flujo completo.

### Formula simple para recordar

Piensalo siempre asi:

```txt
Primero datos -> luego backend -> luego estado -> luego pantalla -> luego detalles visuales
```

Ese orden es el mas estable para crecer sin desorden.

## 8. Comandos utiles

```bash
# Levantar proyecto
ng serve

# Generar componente standalone
ng g c page/quality/Services/LibroReclamos/pages/mi-feature/components/mi-feature --standalone

# Generar servicio
ng g s page/quality/Services/LibroReclamos/pages/mi-feature/services/mi-feature

# Generar interface (archivo manual recomendado)
```

Nota: Para interfaces, normalmente conviene crear el archivo manualmente para controlar bien nombres y agrupacion por dominio.

## 9. Errores comunes y como evitarlos

1. Poner URL en componentes.
Solucion: todo endpoint en environment + service.

2. Usar `any` en payloads.
Solucion: interfaces estrictas para request/response.

3. Mezclar logica de negocio en HTML.
Solucion: mover reglas a metodos del componente o servicio.

4. No resetear paginacion al cambiar filtros.
Solucion: volver a `pageIndex = 0` en cada nueva busqueda.

5. No centralizar estado compartido.
Solucion: shared service por feature.

6. Crear primero el HTML y despues el modelo de datos.
Solucion: empezar siempre por interfaces y payloads.

7. Crear componentes demasiado grandes.
Solucion: separar listado, filtros, modales y acciones en subcomponentes.

## 10. Convencion sugerida de nombres

1. Componente contenedor: `monitoreo.component.ts`.
2. Componente de tabla: `listadoreclamo.component.ts`.
3. Servicio de feature: `monitoreo.service.ts`.
4. Interfaces de dominio: `libro.interface.ts`.
5. Shared state de feature: `global-shared.service.ts`.

## 11. Resumen

Si repites este orden en todos los proyectos:

1. Interface.
2. Endpoint.
3. Service.
4. Container.
5. Presentational.
6. Shared state.

vas a tener modulos mas mantenibles, menos errores en integraciones y un desarrollo mas rapido para nuevas features.
