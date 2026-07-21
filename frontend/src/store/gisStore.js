import { defineStore } from 'pinia'
import { getPoints, getPointDetail, getGisStats } from '@/api/gis'

export const useGisStore = defineStore('gis', {
  state: () => ({
    points: [],
    selectedPoint: null,
    stats: { totalPoints: 0, normal: 0, warning: 0, incomeTotal: 0 }
  }),

  actions: {
    async loadPoints() {
      const [pr, sr] = await Promise.all([getPoints(1), getGisStats(1)])
      if (pr.code === 200) this.points = pr.data || []
      if (sr.code === 200) this.stats = sr.data
    },

    async selectPoint(id) {
      try {
        const r = await getPointDetail(id)
        this.selectedPoint = r.code === 200 ? r.data : this.points.find(p => p.id === id)
      } catch {
        this.selectedPoint = this.points.find(p => p.id === id) || null
      }
    },

    clearSelection() {
      this.selectedPoint = null
    }
  }
})
