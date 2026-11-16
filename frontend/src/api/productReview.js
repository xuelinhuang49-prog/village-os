import request from './request'

/** 待审核的村民上架产品（仅管理端角色可查） */
export function listPendingProducts() {
  return request.get('/admin/product-review/pending')
}

/** 通过审核（转为在售） */
export function approveProduct(id) {
  return request.post(`/admin/product-review/${id}/approve`)
}

/** 驳回（可附审核意见） */
export function rejectProduct(id, note) {
  return request.post(`/admin/product-review/${id}/reject`, { note })
}
