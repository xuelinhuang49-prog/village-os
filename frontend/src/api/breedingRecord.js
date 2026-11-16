import request from './request'

/** 养殖记录列表（可按 archiveId 筛选） */
export function listBreedingRecords(archiveId) {
  return request.get('/breeding-records', { params: archiveId ? { archiveId } : {} })
}

/** 养殖记录详情 */
export function getBreedingRecord(id) {
  return request.get(`/breeding-records/${id}`)
}

/** 新增养殖记录 */
export function createBreedingRecord(data) {
  return request.post('/breeding-records', data)
}

/** 更新养殖记录 */
export function updateBreedingRecord(id, data) {
  return request.put(`/breeding-records/${id}`, data)
}

/** 删除养殖记录 */
export function deleteBreedingRecord(id) {
  return request.delete(`/breeding-records/${id}`)
}
