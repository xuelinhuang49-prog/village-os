import request from './request'

/** 获取所有点位 */
export function getPoints(villageId) {
  return request.get('/gis/points', { params: { villageId } })
}

/** 单点位详情（含IoT数据） */
export function getPointDetail(id) {
  return request.get(`/gis/point/${id}`)
}

/** 按类型筛选 */
export function getPointsByType(type, villageId) {
  return request.get('/gis/points/type', { params: { type, villageId } })
}

/** GIS统计 */
export function getGisStats(villageId) {
  return request.get('/gis/stats', { params: { villageId } })
}
