import request from './request'

/** 订单列表（全量，管理员视角） */
export function listOrders() {
  return request.get('/orders')
}

/** 手工录单 */
export function createOrder(data) {
  return request.post('/orders', data)
}

/** 更新订单（发货/取消等，按字段部分更新） */
export function updateOrder(id, data) {
  return request.put(`/orders/${id}`, data)
}
