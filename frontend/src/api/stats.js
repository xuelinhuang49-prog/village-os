import request from './request'

/** 系统运行统计（管理员端）：土地/作物/产品/订单/民宿/老人等真实业务计数 */
export function getStats() {
  return request.get('/stats')
}
