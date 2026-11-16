import request from './request'

/** 商品列表（管理员视角的村商品台账，全量） */
export function listProducts() {
  return request.get('/products')
}

/** 新增商品 */
export function createProduct(data) {
  return request.post('/products', data)
}

/** 编辑商品（按字段部分更新） */
export function updateProduct(id, data) {
  return request.put(`/products/${id}`, data)
}

/** 删除商品 */
export function removeProduct(id) {
  return request.delete(`/products/${id}`)
}
