import request from './request'

/** 我挂售的农产品（后端强制 where farmer_id = 当前登录农户） */
export function listMySaleProducts() {
  return request.get('/farmer-biz/my-products')
}

/** 上架产品（farmer_id 后端从 token 解析写入，前端不传） */
export function addSaleProduct(data) {
  return request.post('/farmer-biz/product', data)
}

/** 下架/删除（后端强制只能删自己挂售的） */
export function deleteSaleProduct(id) {
  return request.delete(`/farmer-biz/product/${id}`)
}
