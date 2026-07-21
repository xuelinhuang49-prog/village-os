<template>
  <div ref="mapRef" class="gis-map"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGisStore } from '@/store/gisStore'

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke, Text } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { defaults as defaultControls } from 'ol/control'

const CENTER = [108.51, 32.89]
const TYPES = [
  { v: 'gov', c: '#e74c3c' }, { v: 'agriculture', c: '#00d4ff' },
  { v: 'aquaculture', c: '#00ff88' }, { v: 'tourism', c: '#f0a500' },
  { v: 'residence', c: '#a78bfa' }, { v: 'commerce', c: '#fb7185' }
]
function tc(t) { return TYPES.find(x => x.v === t)?.c || '#666' }

const store = useGisStore()
const mapRef = ref(null)
let map, vectorSource

onMounted(() => {
  vectorSource = new VectorSource()
  map = new Map({
    target: mapRef.value,
    controls: defaultControls({ zoom: true, attribution: false }),
    layers: [new TileLayer({ source: new OSM() }), new VectorLayer({ source: vectorSource })],
    view: new View({ center: fromLonLat(CENTER), zoom: 15 })
  })

  map.on('click', (evt) => {
    const ft = map.forEachFeatureAtPixel(evt.pixel, f => f)
    if (ft) { store.selectPoint(ft.get('pid')) } else { store.clearSelection() }
  })
  map.on('pointermove', (evt) => { map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '' })

  renderPoints()
})

onUnmounted(() => map?.setTarget(undefined))

watch(() => store.points, () => renderPoints())

function renderPoints() {
  vectorSource.clear()
  store.points.forEach(p => {
    const c = tc(p.type)
    const f = new Feature({ geometry: new Point(fromLonLat([p.lng, p.lat])), pid: p.id })
    f.setStyle(new Style({
      image: new Circle({ radius: 9, fill: new Fill({ color: c }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
      text: new Text({ text: p.name, font: 'bold 12px "Microsoft YaHei",sans-serif', fill: new Fill({ color: '#e0e6f0' }),
        offsetY: -18, stroke: new Stroke({ color: 'rgba(6,14,26,.8)', width: 3 }) })
    }))
    vectorSource.addFeature(f)
  })
}
</script>

<style scoped>
.gis-map { width: 100%; height: 100%; }
</style>
