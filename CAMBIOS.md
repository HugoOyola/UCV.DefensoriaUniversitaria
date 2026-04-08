# Cambios Realizados - Integración de Denuncias en Dashboard

Fecha: 7 de abril de 2026

## Resumen General

Se ha integrado el mock de denuncias (`denuncias.mock.ts`) en el dashboard de inicio usando una arquitectura modular con:
- **Service Layer**: Capa de datos con `MainService`
- **Component Logic**: Componentes con `inject()` y `signal`
- **Reactive Data**: Uso de `computed` para cálculos derivados

## Archivos Modificados

### 1. `src/app/page/main/services/main.service.ts`

**Cambios:**
- ✅ Importación de `Denuncia` desde `denuncias.interface`
- ✅ Importación de `DENUNCIAS_MOCK` desde `denuncias.mock`
- ✅ Agregación de `delay` y `of` en las importaciones de `rxjs`
- ✅ Nuevo método: `post_Main_ObtenerDenuncias()`

**Código Nuevo:**
```typescript
post_Main_ObtenerDenuncias(): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
	const body: ResponseResultLst<Denuncia> = {
		lstItem: DENUNCIAS_MOCK,
		pagination: {
			pageIndex: 1,
			pageSize: DENUNCIAS_MOCK.length,
			totalRows: DENUNCIAS_MOCK.length,
		},
		isSuccess: true,
		lstError: [],
		ticket: 'mock-denuncias',
		clientName: 'local',
		userName: 'local',
		serverName: 'local',
		resultado: 1,
	};

	return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
}
```

**Por qué:** El método sigue el mismo patrón que `post_Principal_ObtenerDatosPersonales()` pero retorna denuncias. El `delay(500)` simula latencia de red para pruebas realistas.

---

### 2. `src/app/page/main/components/inicio/inicio.component.ts`

#### Cambios en Imports
- ❌ Eliminado: `DestroyRef`
- ❌ Eliminado: `takeUntilDestroyed` de `@angular/core/rxjs-interop`
- ✅ Agregado: `MainService` inyección
- ✅ Agregado: Tipos `Denuncia`, `EstadoDenuncia`, `PrioridadDenuncia`, `TipoUsuarioDenuncia`

**Razón de la simplificación:**
- `DestroyRef` y `takeUntilDestroyed` son útiles para prevenir memory leaks en componentes con múltiples subscripciones de larga duración
- Este componente carga datos **una única vez** en el constructor → sin unsubscribe automático necesario

#### Cambios en el Componente

**Antes (datos quemados):**
```typescript
public readonly opcionesCampus = signal<OpcionCampus[]>([...hardcoded]);
public readonly tarjetasResumen = signal<TarjetaResumen[]>([...hardcoded]);
public readonly reclamosRecientes = signal<ReclamoReciente[]>([...hardcoded]);
```

**Después (datos dinamicos):**
```typescript
private readonly _mainService = inject(MainService);

public readonly denuncias = signal<Denuncia[]>([]);
public readonly cargando = signal<boolean>(true);

public readonly opcionesCampus = computed<OpcionCampus[]>(() => {
	// Dinámicamente extraído desde denuncias
});

public readonly tarjetasResumen = computed<TarjetaResumen[]>(() => {
	// Calculado sobre denuncias en tiempo real
});
```

#### Nuevas Propiedades Privadas

```typescript
private readonly campusPorFilial: Record<string, string> = {
	'1': 'Lima Norte',
	'2': 'Trujillo',
	'3': 'Chiclayo',
	'4': 'Piura',
	'5': 'Tarapoto'
};

private readonly nombreTipoUsuario: Record<TipoUsuarioDenuncia, string> = {
	'13': 'Estudiantes',
	'12': 'Docentes',
	'21': 'Personal administrativo',
	'14': 'Egresados',
	'72': 'Graduados'
};
```

**Por qué:** Diccionarios para mapeos de negocio mantenidos en una sola fuente de verdad.

#### Nuevos Métodos Computados

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `tarjetasResumen` | `computed` | 4 tarjetas con métricas dinámicas (total, pendientes, resueltas, alta prioridad) |
| `distribucionUsuarios` | `computed` | Agrupa denuncias por tipo de usuario con porcentajes |
| `denunciasRecientes` | `computed` | Últimas 6 denuncias ordenadas por fecha |
| `denunciasFiltradas` | `computed` | Denuncias filtradas por campus seleccionado |
| `metricasInferiores` | `computed` | 3 métricas inferiores (apoderados, adjuntos, derivadas) |

#### Nuevos Métodos Privados

```typescript
private cargarDenuncias(): void
private obtenerNombreCampus(filial: string | number | null | undefined): string
private calcularPorcentaje(valor: number, total: number): number
private redondearPorcentaje(valor: number, total: number): string
private tieneOtraAreaMarcada(denuncia: Denuncia): boolean
```

#### Nuevos Métodos Públicos

```typescript
public obtenerSeveridadPrioridad(prioridad: PrioridadDenuncia): 'success' | 'warn' | 'danger' | 'info' | 'secondary'
```

---

### 3. `src/app/page/main/components/inicio/inicio.component.html`

**Cambios de Contenido:**

| Elemento | Antes | Después |
|----------|-------|---------|
| Descripción | "Seguimiento y optimización en la atención de casos..." | "Seguimiento y visualización de denuncias registradas..." |
| Tabla - Título | "Reclamos recientes" | "Denuncias recientes" |
| Tabla - Binding | `[value]="reclamosFiltrados()"` | `[value]="denunciasFiltradas()"` |
| Tabla - Columnas | ID, Fecha, Campus, Estado | Expediente, Fecha, Campus, **Prioridad**, Estado |
| Tabla - Bindings | `reclamo.id`, `reclamo.estado` | `denuncia.expediente`, `denuncia.prioridad`, `denuncia.estado` |

**Nueva Columna Agregada:**
```html
<th class="!bg-transparent !px-3 !py-3 !text-left !border-0 !border-b !border-slate-300 !border-solid">
  Prioridad
</th>

<td class="!px-3 !py-4 !border-0 !border-b !border-slate-200 !border-solid">
  <p-tag [value]="denuncia.prioridad" [severity]="obtenerSeveridadPrioridad(denuncia.prioridad)"
    styleClass="!rounded-full !px-3 !py-1 !text-xs !font-semibold"></p-tag>
</td>
```

---

## Flujo de Datos Actual

```
┌─────────────────────────┐
│   InicioComponent       │
│  (constructor)          │
│  cargarDenuncias()      │
└───────────┬─────────────┘
            │
            ├─→ _mainService.post_Main_ObtenerDenuncias()
            │
            ├─→ Observable HttpResponse (mock con delay 500ms)
            │
            └─→ denuncias.set(response.body.lstItem)
                    │
                    ├─→ computed: opcionesCampus
                    ├─→ computed: tarjetasResumen
                    ├─→ computed: distribucionUsuarios
                    ├─→ computed: denunciasRecientes
                    ├─→ computed: denunciasFiltradas
                    └─→ computed: metricasInferiores
                            │
                            └─→ Template (HTML)
```

---

## Cómo Migrar del Mock al Endpoint Real

### Fase 1: Registrar Endpoints en `environment.ts`

En `src/environments/endpoints.ts`, agregar la configuración:

```typescript
export const routes = {
	// ... rutas existentes ...

	DefensoriaApi: {
		url: 'https://api-defensoriabackend.com/api/', // URL real del backend
		endpoints: {
			Defensoría_ObtenerDenuncias: 'denuncias/obtener',
			Defensoría_CrearDenuncia: 'denuncias/crear',
			Defensoría_ActualizarEstado: 'denuncias/actualizar-estado',
		}
	}
};
```

### Fase 2: Exponer en `environment.ts`

En `src/environments/environment.ts`, agregar bajo `ls_apis`:

```typescript
export const environment = {
	// ... configuración existente ...
	ls_apis: {
		trilceapi2: {
			// ... rutas existentes ...
			routes: {
				// ... rutas existentes ...
				DefensoriaApi: {
					...routes.DefensoriaApi
				}
			}
		}
	}
};
```

### Fase 3: Actualizar `MainService`

**Cambio en `src/app/page/main/services/main.service.ts`:**

```typescript
export class MainService extends GlobalService {
	private TrilcePrincipal = environment.ls_apis.trilceapi2.routes.TrilcePrincipalApi;
	private Incidencia = environment.ls_apis1.trilceapi2.routes.IncidenciaApi;
	private Defensoría = environment.ls_apis.trilceapi2.routes.DefensoriaApi; // ← NUEVO

	// ... métodos existentes ...

	// ❌ REEMPLAZAR ESTO:
	post_Main_ObtenerDenuncias(): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
		const body: ResponseResultLst<Denuncia> = {
			lstItem: DENUNCIAS_MOCK,
			// ...
		};
		return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
	}

	// ✅ POR ESTO:
	post_Main_ObtenerDenuncias(): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
		const url = this.Defensoría.url + this.Defensoría.endpoints.Defensoría_ObtenerDenuncias;
		const params = {
			pageIndex: 1,
			pageSize: 10,
			// agregar filtros si aplican
		};
		return this._http.get<ResponseResultLst<Denuncia>>(url, {
			params,
			headers: this.headers_a_json,
			observe: 'response'
		});
	}
}
```

**Puntos clave:**
- ✅ La firma del método **NO CAMBIA**: sigue retornando `Observable<HttpResponse<ResponseResultLst<Denuncia>>>`
- ✅ El componente **NO NECESITA CAMBIOS**: continúa llamando a `post_Main_ObtenerDenuncias()`
- ✅ El HTML **NO NECESITA CAMBIOS**: el binding sigue siendo el mismo

### Fase 4: Manejo de Errores Mejorado (Opcional)

Si deseas agregar manejo de errores y reintentos:

```typescript
import { catchError, retry } from 'rxjs/operators';

post_Main_ObtenerDenuncias(): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
	const url = this.Defensoría.url + this.Defensoría.endpoints.Defensoría_ObtenerDenuncias;

	return this._http.get<ResponseResultLst<Denuncia>>(url, {
		headers: this.headers_a_json,
		observe: 'response'
	}).pipe(
		retry(2), // 2 reintentos automáticos en caso de error
		catchError((error) => {
			console.error('Error cargando denuncias:', error);
			throw error;
		})
	);
}
```

---

## Mejores Prácticas Aplicadas

| Patrón | Aplicación |
|--------|-----------|
| **Single Responsibility** | Cada método en el servicio hace UNA cosa |
| **Dependency Injection** | `inject(MainService)` en lugar de constructor |
| **Signals & Computed** | Estado reactivo sin Observable complexity innecesaria |
| **Type Safety** | Interfaces estrictas `ResponseResultLst<Denuncia>` |
| **Separation of Concerns** | Service (datos) ≠ Component (lógica UI) |
| **No Magic Strings** | URLs centralizadas en `environment.ts` |
| **Testability** | Método `post_Main_ObtenerDenuncias()` mockeable fácilmente |

---

## Testing del Mock

Para verificar que todo funciona:

```bash
# 1. Levantar la aplicación
ng serve

# 2. Abrir navegador en http://localhost:4200
# 3. Navegar a la sección de Inicio
# 4. Verificar que:
#    - Cargan los 12 registros de DENUNCIAS_MOCK
#    - Se calculan las tarjetas dinámicamente
#    - El filtro de campus funciona
#    - La tabla muestra expediente, fecha, campus, prioridad y estado
#    - Los colores de severidad corresponden a estado/prioridad
```

---

## Próximos Pasos

1. **Validar Mock funcione correctamente** ✓ (Actual)
2. **Backend proporciona endpoint real** → Ejecutar Fase 3
3. **Agregar paginación real** → Extender `post_Main_ObtenerDenuncias()` con page/size params
4. **Agregar acciones por fila** → Nueva sección en componente
5. **Crear subcomponents** si la lógica crece (filtros, modal detalle, etc.)

---

## Resumen de Beneficios

✅ **Modular**: Cada parte tiene responsabilidad clara
✅ **Testeable**: Mock fácil de reemplazar con HTTP
✅ **Reactivo**: Cambios automáticos en signals/computed
✅ **Escalable**: Nueva funcionalidad sin refactor mayor
✅ **DRY**: Sin data duplicada en components
✅ **Type-Safe**: TypeScript tipado desde inicio a fin
