import type { NivelAcademico } from "./nivelesacademico"

export interface Programa {
  id: number
  idNivelAcademico: number
  nombre: string
  descripcion: string
  version: number
  duracion_meses: number
  costo: number
  fecha_inicio: Date
  estadio: string
  nivelAcademico: NivelAcademico
}
