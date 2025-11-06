<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivelesacademico'
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Button, Dialog, InputMask, InputText, Select, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'programas'
const props = defineProps({
  mostrar: Boolean,
  programa: {
    type: Object as () => Programa,
    default: () => ({}) as Programa,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const nivelesAcademicos = ref<NivelAcademico[]>([])


const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const programa = ref<Programa>({ ...props.programa })
const idArtista = ref<number>(0)
watch(
  () => props.programa,
  (newVal) => {
    programa.value = { ...newVal }
  },
)

async function obtenerNivelesAcademicos() {
  nivelesAcademicos.value = await http.get('niveles-academicos').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idNivelAcademico: programa.value.nivelAcademico.id,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    programa.value = {} as Programa
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerNivelesAcademicos()

      if (props.programa?.id) {
        programa.value = { ...props.programa }
        nivelesAcademicos.value = programa.value.nivelAcademico.id
        obtenerNivelesAcademicos()
      } else {
        nivelesAcademicos.value = 0
        programa.value = { nivelAcademico: { id: 0 }, album: { id: 0 } } as Programa
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nivelacademico" class="font-semibold w-3">Nivel Académico</label>
        <Select
          id="nivelacademico"
          v-model="programa.nivelAcademico.id"
          :options="nivelesAcademicos"
          optionLabel="descripcion"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="artista" class="font-semibold w-3">Artista</label>
        <Select
          id="artista"
          v-model="idArtista"
          :options="artistas"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          @change="obtenerAlbumes"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="album" class="font-semibold w-3">Album</label>
        <Select
          id="album"
          v-model="cancion.album.id"
          :options="albumes"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="cancion.nombre"
          class="flex-auto"
          autocomplete="off"
          maxlength="40"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="duracion" class="font-semibold w-3">Duración</label>
        <InputMask
          id="duracion"
          v-model="cancion.duracion"
          class="flex-auto"
          autocomplete="off"
          mask="99:99"
          placeholder="03:45"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tags" class="font-semibold w-3">Tags</label>
        <InputText
          id="tags"
          v-model="cancion.tags"
          class="flex-auto"
          autocomplete="off"
          maxlength="30"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="url" class="font-semibold w-3">URL Canción</label>
        <Textarea
          id="url"
          v-model="cancion.url"
          class="flex-auto"
          autocomplete="off"
          rows="3"
          maxlength="250"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
