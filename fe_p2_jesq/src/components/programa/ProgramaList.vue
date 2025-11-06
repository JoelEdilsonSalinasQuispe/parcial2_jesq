// ...existing code...
<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'

// importar componentes de PrimeVue como default (si no están registrados globalmente)
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'

import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'programas'
const programas = ref<Programa[]>([])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

const emit = defineEmits(['edit'])

const programasFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return programas.value
  return programas.value.filter((p) => {
    const nivelNombre =
      // si la API devuelve el objeto relacionado
      (p as any).nivelacademico?.nombre ||
      (p as any).nivelAcademico?.nombre ||
      String(p.idnivelacademico || '').toLowerCase()
    return (
      String(p.nombre || '').toLowerCase().includes(q) ||
      String(p.descripcion || '').toLowerCase().includes(q) ||
      String(p.estado || '').toLowerCase().includes(q) ||
      String(nivelNombre).toLowerCase().includes(q)
    )
  })
})

async function obtenerLista() {
  try {
    const response = await http.get(ENDPOINT)
    console.log('programas listado', response.status, response.data)
    programas.value = response.data
  } catch (error: any) {
    console.error('Error al obtener programas:', error?.response?.status, error?.response?.data || error?.message)
  }
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!programaDelete.value) return
  try {
    await http.delete(`${ENDPOINT}/${programaDelete.value.id}`)
    await obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    console.error('Error al eliminar programa:', error?.response?.status, error?.response?.data || error?.message)
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, descripción, nivel o estado" />
      </InputGroup>
    </div>

    <DataTable
      :value="programasFiltrados"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      tableStyle="min-width: 50rem"
      class="mt-4"
    >
      <Column field="id" header="ID" style="width: 6rem"></Column>
      <Column header="Nivel Académico" style="min-width: 160px">
        <template #body="{ data }">
          <span>
            {{ (data as any).nivel_academico?.nombre || (data as any).nivelAcademico?.nombre || data.id_nivel_academico }}
          </span>
        </template>
      </Column>
      <Column field="nombre" header="Nombre" sortable style="min-width: 200px"></Column>
      <Column field="descripcion" header="Descripción" sortable style="min-width: 300px">
        <template #body="{ data }">
          <span>{{ data.descripcion }}</span>
        </template>
      </Column>
      <Column field="version" header="Versión" sortable style="width: 8rem"></Column>
      <Column field="duracion_meses" header="Duración (meses)" sortable style="width: 12rem"></Column>
      <Column header="Costo" sortable style="width: 10rem">
        <template #body="{ data }">
          <span>{{ Number(data.costo).toFixed(2) }}</span>
        </template>
      </Column>
      <Column field="fecha_inicio" header="Fecha inicio" sortable style="width: 12rem">
        <template #body="{ data }">
          <span>{{ data.fecha_inicio ? new Date(data.fecha_inicio).toLocaleDateString() : '' }}</span>
        </template>
      </Column>
      <Column field="estado" header="Estado" sortable style="width: 14rem"></Column>

      <Column header="Acciones" style="min-width: 140px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el programa {{ programaDelete?.nombre }}?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* estilos mínimos para que la tabla tenga separación */
.mt-4 { margin-top: 1rem; }
</style>
```// filepath: d:\Gestion 02-25\parcial2_jesq\fe_p2_jesq\src\components\programa\ProgramaList.vue
// ...existing code...
<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'

// importar componentes de PrimeVue como default (si no están registrados globalmente)
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'

import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'programas'
const programas = ref<Programa[]>([])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

const emit = defineEmits(['edit'])

const programasFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return programas.value
  return programas.value.filter((p) => {
    const nivelNombre =
      // si la API devuelve el objeto relacionado
      (p as any).nivel_academico?.nombre ||
      (p as any).nivelAcademico?.nombre ||
      String(p.id_nivel_academico || '').toLowerCase()
    return (
      String(p.nombre || '').toLowerCase().includes(q) ||
      String(p.descripcion || '').toLowerCase().includes(q) ||
      String(p.estado || '').toLowerCase().includes(q) ||
      String(nivelNombre).toLowerCase().includes(q)
    )
  })
})

async function obtenerLista() {
  try {
    const response = await http.get(ENDPOINT)
    console.log('programas listado', response.status, response.data)
    programas.value = response.data
  } catch (error: any) {
    console.error('Error al obtener programas:', error?.response?.status, error?.response?.data || error?.message)
  }
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!programaDelete.value) return
  try {
    await http.delete(`${ENDPOINT}/${programaDelete.value.id}`)
    await obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    console.error('Error al eliminar programa:', error?.response?.status, error?.response?.data || error?.message)
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, descripción, nivel o estado" />
      </InputGroup>
    </div>

    <DataTable
      :value="programasFiltrados"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      tableStyle="min-width: 50rem"
      class="mt-4"
    >
      <Column field="id" header="ID" style="width: 6rem"></Column>
      <Column header="Nivel Académico" style="min-width: 160px">
        <template #body="{ data }">
          <span>
            {{ (data as any).nivel_academico?.nombre || (data as any).nivelAcademico?.nombre || data.id_nivel_academico }}
          </span>
        </template>
      </Column>
      <Column field="nombre" header="Nombre" sortable style="min-width: 200px"></Column>
      <Column field="descripcion" header="Descripción" sortable style="min-width: 300px">
        <template #body="{ data }">
          <span>{{ data.descripcion }}</span>
        </template>
      </Column>
      <Column field="version" header="Versión" sortable style="width: 8rem"></Column>
      <Column field="duracion_meses" header="Duración (meses)" sortable style="width: 12rem"></Column>
      <Column header="Costo" sortable style="width: 10rem">
        <template #body="{ data }">
          <span>{{ Number(data.costo).toFixed(2) }}</span>
        </template>
      </Column>
      <Column field="fecha_inicio" header="Fecha inicio" sortable style="width: 12rem">
        <template #body="{ data }">
          <span>{{ data.fecha_inicio ? new Date(data.fecha_inicio).toLocaleDateString() : '' }}</span>
        </template>
      </Column>
      <Column field="estado" header="Estado" sortable style="width: 14rem"></Column>

      <Column header="Acciones" style="min-width: 140px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el programa {{ programaDelete?.nombre }}?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* estilos mínimos para que la tabla tenga separación */
.mt-4 { margin-top: 1rem; }
</style>