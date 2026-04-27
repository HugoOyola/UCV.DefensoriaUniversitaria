import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseResultLst } from '@app/core/interface/responseResult.interface';
import {
  Adjunto,
  Denuncia,
  EstadoDenuncia,
  ExpedienteDU,
  ListarExpedientesDUParam,
  OtraAreaDenuncia,
  TipoUsuarioDenuncia,
} from '../interface/denuncias.interface';
import { Observable, map } from 'rxjs';
import { MainService } from './main.service';

export interface ConsultaDenuncias {
  // Perfil de usuario usado por el endpoint para segmentar resultados.
  idPerfil?: number;
  // Texto libre de busqueda que entiende el backend.
  busqueda?: string;
  // Filtros numericos del endpoint (0 = sin filtro).
  estadoExp?: number;
  prioridades?: number;
  // Rango de fechas para filtrar expedientes.
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

@Injectable({
  providedIn: 'root',
})
export class DenunciasService {
  private readonly mainService = inject(MainService);

  // 1) Construye el request y retorna la respuesta HTTP conservando metadata.
  listarDenunciasResponse(
    consulta: ConsultaDenuncias = {}
  ): Observable<HttpResponse<ResponseResultLst<Denuncia>>> {
    // Normaliza parametros para no repetir defaults en componentes.
    const param: ListarExpedientesDUParam = {
      idPerfil: consulta.idPerfil ?? 12,
      busqueda: consulta.busqueda ?? '',
      fechaInicio: this.toStartOfDayIso(consulta.fechaInicio),
      fechaFin: this.toEndOfDayIso(consulta.fechaFin),
      estadoExp: consulta.estadoExp ?? 0,
      prioridades: consulta.prioridades ?? 0,
    };

    return this.mainService.post_Expedientes_ListarExpedientesDU(param).pipe(
      map((response) => {
        const body = response.body;
        // 2) Mapea cada expediente del backend al modelo de UI.
        const mapped: ResponseResultLst<Denuncia> | null = body
          ? {
              ...body,
              lstItem: body.lstItem.map((exp) => this.mapExpedienteToDenuncia(exp)),
            }
          : null;

        // 3) Devuelve el mismo HttpResponse con body transformado.
        return response.clone({ body: mapped });
      })
    );
  }

  // Atajo para los componentes que solo necesitan la lista de denuncias.
  listarDenuncias(consulta: ConsultaDenuncias = {}): Observable<Denuncia[]> {
    // Version simplificada para vistas que solo requieren la lista.
    return this.listarDenunciasResponse(consulta).pipe(
      map((response) => response.body?.lstItem ?? [])
    );
  }

  // Mapeo de contrato API (ExpedienteDU) a contrato de UI (Denuncia).
  private mapExpedienteToDenuncia(exp: ExpedienteDU): Denuncia {
    // Adaptador de contrato: backend (ExpedienteDU) -> UI (Denuncia).
    return {
      expediente: exp.formatoExpediente,
      fecha: new Date(exp.fechaRegistro),
      tipoUsuario: String(exp.tipoUsuario) as TipoUsuarioDenuncia,
      estado: this.mapEstado(exp.expEstado),
      prioridad: null,
      asignado: null,
      filial: exp.cFilial,
      nombre: exp.nombreUsuario,
      apellidos: exp.apellidoUsuario,
      documento: exp.documento,
      escuelaProfesional: exp.cUniOrgNombre,
      modalidad: exp.tipoModalidad,
      domicilio: exp.direccion,
      telefono: exp.telefono,
      email: exp.correo,
      isApoderado: exp.tieneApoderado?.toLowerCase() === 'true',
      apoderadoApellidos: exp.apoApellidos ?? undefined,
      apoderadoNombres: exp.apoNombres ?? undefined,
      apoderadoEmail: exp.apoCorreo ?? undefined,
      otraArea: this.mapOtraArea(exp.opcionesTexto),
      otraAreaOtro: exp.textoOtros ?? undefined,
      expone: exp.descripcion,
      solicita: exp.solicita,
      adjuntos: exp.archivos?.map(
        (archivo) =>
          ({
            nombre: archivo.nombreArchivo,
            url: this.buildAdjuntoUrl(archivo.cGoogleDriveId),
            tipo: archivo.mimeType,
            tamanio: archivo.tamanoBytes,
          }) as Adjunto
      ),
    };
  }

  private buildAdjuntoUrl(fileId: string | null | undefined): string | undefined {
    // Si no hay id de archivo, se mantiene adjunto sin URL.
    const id = (fileId ?? '').trim();
    if (!id) {
      return undefined;
    }

    return `https://ucvapi.azure-api.net/gdrive/Drive/ShowFile/${id}/2`;
  }

  private mapEstado(expEstado: number): EstadoDenuncia | null {
    // Catalogo numerico del backend a etiquetas de estado para UI.
    switch (expEstado) {
      case 1:
        return 'Sin Atender';
      case 2:
        return 'Pendiente';
      case 3:
        return 'En Proceso';
      case 4:
        return 'Resuelto';
      default:
        return null;
    }
  }

  private mapOtraArea(opcionesTexto: string | null | undefined): OtraAreaDenuncia {
    // Convierte texto libre en flags booleanos para checks en la vista.
    const texto = (opcionesTexto ?? '').toLowerCase();
    return {
      libro: texto.includes('libro'),
      tribunal: texto.includes('tribunal'),
      comision: texto.includes('comision'),
      direccion: texto.includes('direccion'),
      secretaria: texto.includes('secretaria'),
      cap: texto.includes('cap'),
      otro: texto.includes('otro'),
    };
  }

  private toStartOfDayIso(value?: Date | null): string {
    // Fecha normalizada al inicio del dia para filtros inclusivos.
    if (!value || Number.isNaN(value.getTime())) {
      return '';
    }

    const start = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
    return start.toISOString();
  }

  private toEndOfDayIso(value?: Date | null): string {
    // Fecha normalizada al fin del dia para cerrar el rango.
    if (!value || Number.isNaN(value.getTime())) {
      return '';
    }

    const end = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);
    return end.toISOString();
  }
}