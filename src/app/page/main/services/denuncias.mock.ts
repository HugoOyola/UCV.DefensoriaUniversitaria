import { Denuncia } from '../interface/denuncias.interface';

export const DENUNCIAS_MOCK: Denuncia[] = [
  {
    expediente: 'DEF-2026-001',
    fecha: new Date('2026-03-20T09:15:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: null,

    tipoUsuario: '13',
    filial: 1,
    nombre: 'María Elena',
    apellidos: 'García Rodríguez',
    documento: '45879632',
    escuelaProfesional: 101,
    modalidad: 5001,
    domicilio: 'Av. Universitaria 245, San Miguel',
    telefono: '987654321',
    email: 'maria.garcia@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: null,

    otraArea: {
      libro: true,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Presenté un reclamo por cobro adicional en mi matrícula, pero hasta la fecha no he recibido una respuesta clara ni la devolución correspondiente. Considero que el monto cobrado no corresponde a los conceptos informados.',
    solicita:
      'Solicito la revisión del cobro efectuado y la devolución del monto pagado en exceso, así como una respuesta formal sobre el motivo del cargo aplicado.',

    adjuntos: [
      { nombre: 'voucher-pago.pdf', url: '/assets/mock/voucher-pago.pdf' },
      { nombre: 'captura-matricula.png', url: '/assets/mock/captura-matricula.png' }
    ]
  },

  {
    expediente: 'DEF-2026-002',
    fecha: new Date('2026-03-20T11:40:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: 'Analista DU - Carla Rojas',

    tipoUsuario: '12',
    filial: 2,
    nombre: 'Carlos Alberto',
    apellidos: 'Mendoza Silva',
    documento: '73458962',
    escuelaProfesional: 205,
    modalidad: 5002,
    domicilio: 'Jr. Los Álamos 560, Pueblo Libre',
    telefono: '976543210',
    email: 'carlos.mendoza@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: true,
      secretaria: false,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Se modificó mi carga horaria académica sin comunicación previa, afectando la organización de mis clases y compromisos asumidos con los estudiantes. No se me brindó sustento administrativo oportuno.',
    solicita:
      'Solicito que se revise la modificación realizada y se me informe formalmente el sustento de dicho cambio, además de restituir la carga horaria inicialmente aprobada si corresponde.',

    adjuntos: [
      { nombre: 'horario-anterior.pdf', url: '/assets/mock/horario-anterior.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-003',
    fecha: new Date('2026-03-21T08:20:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: 'Especialista DU - Luis Torres',

    tipoUsuario: '21',
    filial: 3,
    nombre: 'Patricia',
    apellidos: 'Vásquez Torres',
    documento: '41236789',
    escuelaProfesional: null,
    modalidad: null,
    domicilio: 'Calle Las Flores 900, Los Olivos',
    telefono: '945612378',
    email: 'patricia.vasquez@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: 301,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: true,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Solicité orientación sobre la aplicación de nuevas políticas internas relacionadas con permisos por salud, ya que existían interpretaciones distintas en mi unidad administrativa.',
    solicita:
      'Solicito que se me brinde una respuesta formal y uniforme respecto al procedimiento aplicable en estos casos.',

    adjuntos: []
  },

  {
    expediente: 'DEF-2026-004',
    fecha: new Date('2026-03-21T10:05:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: null,

    tipoUsuario: '14',
    filial: 1,
    nombre: 'José Miguel',
    apellidos: 'Herrera Ruiz',
    documento: '45896335',
    escuelaProfesional: 110,
    modalidad: 5003,
    domicilio: 'Av. Brasil 1450, Breña',
    telefono: '998761245',
    email: 'jose.herrera@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: true
    },
    otraAreaOtro: 'Mesa de Partes Virtual',

    expone:
      'Solicité la emisión de mis certificados académicos hace más de dos meses y no he recibido respuesta ni fecha estimada de entrega. Esta demora está afectando un trámite laboral urgente.',
    solicita:
      'Solicito la emisión inmediata de mis certificados o, en su defecto, una constancia formal del estado del trámite y fecha cierta de atención.',

    adjuntos: [
      { nombre: 'solicitud-certificados.pdf', url: '/assets/mock/solicitud-certificados.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-005',
    fecha: new Date('2026-03-21T15:30:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: 'Coordinadora DU - Ana Salinas',

    tipoUsuario: '13',
    filial: 4,
    nombre: 'Lucía Fernanda',
    apellidos: 'Ríos Castillo',
    documento: '70984561',
    escuelaProfesional: 407,
    modalidad: 5001,
    domicilio: 'Mz. B Lt. 12, Villa El Salvador',
    telefono: '934567812',
    email: 'lucia.rios@correo.com',

    isApoderado: true,
    apoderadoApellidos: 'Ríos Mendoza',
    apoderadoNombres: 'Carmen Julia',
    apoderadoEmail: 'carmen.rios@correo.com',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: true,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Mi hija menor de edad viene siendo afectada por una situación reiterada de hostigamiento verbal dentro del entorno universitario. Ya se presentó una comunicación previa, pero no se han adoptado medidas claras.',
    solicita:
      'Solicito que se active la atención correspondiente, se realice la investigación del caso y se informe formalmente sobre las medidas de protección adoptadas.',

    adjuntos: [
      { nombre: 'capturas-conversacion.pdf', url: '/assets/mock/capturas-conversacion.pdf' },
      { nombre: 'reporte-incidencia.docx', url: '/assets/mock/reporte-incidencia.docx' }
    ]
  },

  {
    expediente: 'DEF-2026-006',
    fecha: new Date('2026-03-22T09:00:00'),
    estado: null,
    prioridad: null,
    clasificacion: null,
    asignado: 'Analista DU - Marco Peña',

    tipoUsuario: '72',
    filial: 2,
    nombre: 'Fernando Alonso',
    apellidos: 'Castro López',
    documento: '48621597',
    escuelaProfesional: 210,
    modalidad: 5002,
    domicilio: 'Jr. Moquegua 320, Cercado de Lima',
    telefono: '955321478',
    email: 'fernando.castro@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: true,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Detecté un error en los datos consignados en mi diploma de grado, específicamente en el segundo apellido, lo cual impide que pueda usar el documento en trámites externos.',
    solicita:
      'Solicito la corrección de mis datos y la reemisión del diploma correspondiente con la información correcta.',

    adjuntos: [
      { nombre: 'diploma-observado.pdf', url: '/assets/mock/diploma-observado.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-007',
    fecha: new Date('2026-03-22T13:25:00'),
    estado: 'Pendiente',
    prioridad: 'Media',
    asignado: null,

    tipoUsuario: '21',
    filial: 5,
    nombre: 'Diego Alejandro',
    apellidos: 'Sánchez Paredes',
    documento: '52361478',
    escuelaProfesional: null,
    modalidad: null,
    domicilio: 'Av. Próceres 789, SJL',
    telefono: '966258741',
    email: 'diego.sanchez@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: 502,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: true,
      secretaria: false,
      cap: true,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Durante un proceso interno de promoción, advertí criterios discriminatorios en la evaluación de postulantes, sin transparencia suficiente ni acceso a los resultados completos.',
    solicita:
      'Solicito que se revise el procedimiento realizado, se garantice transparencia en la evaluación y se emita una respuesta formal sobre los criterios aplicados.',

    adjuntos: [
      { nombre: 'bases-promocion.pdf', url: '/assets/mock/bases-promocion.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-008',
    fecha: new Date('2026-03-23T10:10:00'),
    estado: 'En Proceso',
    prioridad: 'Baja',
    asignado: 'Especialista DU - Rosa Huamán',

    tipoUsuario: '13',
    filial: 3,
    nombre: 'Valeria Cristina',
    apellidos: 'López González',
    documento: '74125896',
    escuelaProfesional: 315,
    modalidad: 5001,
    domicilio: 'Calle Los Jazmines 223, Comas',
    telefono: '989741236',
    email: 'valeria.lopez@correo.com',

    isApoderado: false,
    apoderadoApellidos: '',
    apoderadoNombres: '',
    apoderadoEmail: '',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: true
    },
    otraAreaOtro: 'Coordinación Académica',

    expone:
      'Solicité la revisión de mi nota final debido a una posible inconsistencia entre la rúbrica aplicada y la calificación registrada en el sistema, pero no he recibido respuesta concluyente.',
    solicita:
      'Solicito una revisión formal de la evaluación y que se me informe por escrito el resultado del análisis realizado.',

    adjuntos: []
  },

  {
    expediente: 'DEF-2026-009',
    fecha: new Date('2026-03-23T14:45:00'),
    estado: 'Pendiente',
    prioridad: 'Alta',
    asignado: null,

    tipoUsuario: '13',
    filial: 1,
    nombre: 'Sebastián André',
    apellidos: 'Paredes Núñez',
    documento: '75896321',
    escuelaProfesional: 110,
    modalidad: 5001,
    domicilio: 'Av. Colonial 1320, Callao',
    telefono: '987001245',
    email: 'sebastian.paredes@correo.com',

    isApoderado: true,
    apoderadoApellidos: 'Núñez Cárdenas',
    apoderadoNombres: 'Rosa Elena',
    apoderadoEmail: 'rosa.nunez@correo.com',

    area: null,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Como apoderada del estudiante, reporto retrasos reiterados en la atención de su trámite de matrícula extemporánea, pese a haber cumplido con todos los requisitos solicitados.',
    solicita:
      'Solicito la atención inmediata del trámite y la confirmación formal del estado de matrícula del estudiante para no afectar su ciclo académico.',

    adjuntos: [
      { nombre: 'cargo-matricula.pdf', url: '/assets/mock/cargo-matricula.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-010',
    fecha: new Date('2026-03-24T09:35:00'),
    estado: 'En Proceso',
    prioridad: 'Media',
    asignado: 'Analista DU - Paola Rivera',

    tipoUsuario: '21',
    filial: 4,
    nombre: 'Jorge Luis',
    apellidos: 'Acuña Vega',
    documento: '48471529',
    escuelaProfesional: null,
    modalidad: null,
    domicilio: 'Jr. Túpac Amaru 450, Piura',
    telefono: '954220117',
    email: 'jorge.acuna@correo.com',

    isApoderado: true,
    apoderadoApellidos: 'Vega Paredes',
    apoderadoNombres: 'María Isabel',
    apoderadoEmail: 'maria.vega@correo.com',

    area: 502,

    otraArea: {
      libro: true,
      tribunal: false,
      comision: false,
      direccion: true,
      secretaria: false,
      cap: true,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Como apoderada del trabajador, informo que su solicitud de regularización de horario fue observada sin sustento claro, generando descuentos en su remuneración.',
    solicita:
      'Solicito la revisión del caso, la suspensión de descuentos y la emisión de una respuesta administrativa debidamente fundamentada.',

    adjuntos: [
      { nombre: 'boleta-observada.pdf', url: '/assets/mock/boleta-observada.pdf' },
      { nombre: 'solicitud-horario.docx', url: '/assets/mock/solicitud-horario.docx' }
    ]
  },

  {
    expediente: 'DEF-2026-011',
    fecha: new Date('2026-03-24T16:05:00'),
    estado: 'Pendiente',
    prioridad: 'Alta',
    asignado: null,

    tipoUsuario: '13',
    filial: 2,
    nombre: 'Camila Andrea',
    apellidos: 'Quispe Salazar',
    documento: '70236654',
    escuelaProfesional: 315,
    modalidad: 5003,
    domicilio: 'Av. Los Alisos 785, SMP',
    telefono: '943114826',
    email: 'camila.quispe@correo.com',

    isApoderado: true,
    apoderadoApellidos: 'Salazar Rojas',
    apoderadoNombres: 'Héctor Manuel',
    apoderadoEmail: 'hector.salazar@correo.com',

    area: null,

    otraArea: {
      libro: false,
      tribunal: true,
      comision: true,
      direccion: false,
      secretaria: true,
      cap: false,
      otro: true
    },
    otraAreaOtro: 'Coordinación de Tutoría',

    expone:
      'Como apoderado de la estudiante, comunico que existen incidencias reiteradas en su proceso de evaluación y no se ha brindado una respuesta integral a los reclamos presentados.',
    solicita:
      'Solicito la revisión de evaluaciones observadas, una reunión con el área responsable y la comunicación de medidas correctivas dentro de un plazo razonable.',

    adjuntos: [
      { nombre: 'historial-reclamos.pdf', url: '/assets/mock/historial-reclamos.pdf' }
    ]
  },

  {
    expediente: 'DEF-2026-012',
    fecha: new Date('2026-03-25T08:50:00'),
    estado: 'Resuelto',
    prioridad: 'Baja',
    asignado: 'Especialista DU - Julio Cárdenas',

    tipoUsuario: '12',
    filial: 5,
    nombre: 'Renato Martín',
    apellidos: 'Delgado Ponce',
    documento: '46625841',
    escuelaProfesional: null,
    modalidad: null,
    domicilio: 'Calle 10 Mz. K Lt. 4, Ate',
    telefono: '980445123',
    email: 'renato.delgado@correo.com',

    isApoderado: true,
    apoderadoApellidos: 'Ponce Calderón',
    apoderadoNombres: 'Elena Raquel',
    apoderadoEmail: 'elena.ponce@correo.com',

    area: 302,

    otraArea: {
      libro: false,
      tribunal: false,
      comision: false,
      direccion: false,
      secretaria: false,
      cap: false,
      otro: false
    },
    otraAreaOtro: '',

    expone:
      'Como apoderada del docente, solicité revisión de una observación administrativa vinculada a su carga de trabajo, la cual ya fue atendida por el área correspondiente.',
    solicita:
      'Solicito únicamente la constancia final de cierre del caso para archivo personal y seguimiento institucional.',

    adjuntos: []
  }
];