// ─── Tipos ────────────────────────────────────────────────────────────────────
export type EstadoDenuncia = 'Pendiente' | 'En Proceso' | 'Resuelto';
export type PrioridadDenuncia = 'Alta' | 'Media' | 'Baja';

/**
 * Valores reales del formulario:
 * 13 = estudiante
 * 12 = docente
 * 21 = administrativo
 * 14 = egresado
 * 72 = graduado
 */
export type TipoUsuarioDenuncia = '13' | '12' | '21' | '14' | '72';

export type TipoEventoHistorial =
  | 'registro'
  | 'asignacion'
  | 'cambio_estado'
  | 'respuesta'
  | 'derivacion';

export type AreaPreviaDenuncia =
  | 'Libro de Reclamaciones'
  | 'Tribunal de Honor'
  | 'Comisión de Hostigamiento'
  | 'Dirección General'
  | 'Secretaría General'
  | 'SUNEDU'
  | 'Centro de Atención Personalizada'
  | 'Indecopi'
  | 'Otro';

// ─── Interfaces ───────────────────────────────────────────────────────────────

/**
 * Interfaz principal de denuncia adaptada a la estructura del formulario
 */
export interface Denuncia {
  expediente: string;
  fecha: Date;

  tipoUsuario: TipoUsuarioDenuncia;
  estado: EstadoDenuncia;
  prioridad: PrioridadDenuncia;
  asignado?: string | null;

  // Información institucional
  filial: string | number | null;

  // Información personal
  nombre: string;
  apellidos: string;
  documento: string;
  escuelaProfesional?: string | number | null;
  modalidad?: string | number | null;
  domicilio: string;
  telefono: string;
  email: string;

  // Apoderado
  isApoderado: boolean;
  apoderadoApellidos?: string;
  apoderadoNombres?: string;
  apoderadoEmail?: string;

  // Solo aplica si corresponde
  area?: string | number | null;

  // ¿Este requerimiento se ingresó a otra área?
  otraArea: OtraAreaDenuncia;
  otraAreaOtro?: string;

  // Descripción de la denuncia/reclamo
  expone: string;
  solicita: string;

  // Adjuntos
  adjuntos?: Adjunto[];

  // Campos opcionales adicionales para dashboard o gestión interna
  clasificacion?: string;
}

/**
 * Estructura exacta del bloque "otra área" del formulario
 */
export interface OtraAreaDenuncia {
  libro: boolean;
  tribunal: boolean;
  comision: boolean;
  direccion: boolean;
  secretaria: boolean;
  cap: boolean;
  otro: boolean;
}

/**
 * Interfaz para documentos adjuntos
 */
export interface Adjunto {
  nombre: string;
  url: string;
  tipo?: string;
  tamanio?: number;
}

/**
 * Interfaz para el historial de eventos de una denuncia
 */
export interface HistorialDenuncia {
  tipo: TipoEventoHistorial;
  descripcion: string;
  fecha: Date;
  usuario: string;
  area?: string;
  correoEnviado?: boolean;
  adjuntos?: Adjunto[];
}

/**
 * Interfaz para respuestas a denuncias
 */
export interface RespuestaDenuncia {
  asunto: string;
  destinatario: string;
  mensaje: string;
  adjuntos?: File[];
}

/**
 * Interfaz para derivación de denuncias
 */
export interface DerivacionDenuncia {
  expediente: string;
  tipoDestino: 'area' | 'programa';
  destinoId: string;
  motivo: string;
}

/**
 * Interfaz para estilos de tipo de usuario
 */
export interface TipoUsuarioStyle {
  iconBg: string;
  iconColor: string;
  icon: string;
}

/**
 * Interfaz para estilos de estado
 */
export interface EstadoStyle {
  bg: string;
  text: string;
  border: string;
  icon: string;
  animation: string;
}

/**
 * Interfaz para estilos de prioridad
 */
export interface PrioridadStyle {
  bg: string;
  text: string;
  dotBg: string;
  animation: string;
}

/**
 * Interfaz para filtros de búsqueda
 */
export interface FiltrosDenuncia {
  searchTerm?: string;
  estado?: EstadoDenuncia;
  prioridad?: PrioridadDenuncia;
  tipoUsuario?: TipoUsuarioDenuncia;
  fechaInicio?: Date;
  fechaFin?: Date;
  filial?: string | number | null;
}

/**
 * Interfaz para estadísticas de denuncias
 */
export interface EstadisticasDenuncia {
  total: number;
  pendientes: number;
  enProceso: number;
  resueltas: number;
  porTipoUsuario: { [key in TipoUsuarioDenuncia]: number };
  porPrioridad: { [key in PrioridadDenuncia]: number };
}

/**
 * Interfaz para item de clasificación
 */
export interface ClasificacionItem {
  label: string;
  value: string;
}

/**
 * Interfaz para grupo de clasificaciones
 */
export interface ClasificacionGrupo {
  label: string;
  items: ClasificacionItem[];
}

/**
 * Interfaz para opciones simples (ej: unidad, estado, prioridad)
 */
export interface OpcionSimple {
  label: string;
  value: string;
}