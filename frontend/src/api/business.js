import request from './request'

/** 我的产品（后端强制 where owner_id = 当前登录经营主体，防止越权看别人产品） */
export function listMyProducts() {
  return request.get('/business/my-products')
}

/** 添加产品（owner_id 后端从 token 解析写入，前端不传，防止篡改归属） */
export function addProduct(data) {
  return request.post('/business/product', data)
}

/** 删除产品（后端强制只能删自己名下的） */
export function deleteProduct(id) {
  return request.delete(`/business/product/${id}`)
}
