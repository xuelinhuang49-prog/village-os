import request from './request'

/** 养殖档案列表 */
export function listLivestock() {
  return request.get('/livestock')
}

/** 养殖档案详情 */
export function getLivestock(id) {
  return request.get(`/livestock/${id}`)
}

/** 新增养殖档案 */
export function createLivestock(data) {
  return request.post('/livestock', data)
}

/** 更新养殖档案（全量） */
export function updateLivestock(id, data) {
  return request.put(`/livestock/${id}`, data)
}

/** 删除养殖档案 */
export function deleteLivestock(id) {
  return request.delete(`/livestock/${id}`)
}
