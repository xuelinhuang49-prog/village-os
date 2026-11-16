import request from './request'

/** 惠农政策列表（公域数据，公开可查、无需登录；可按分类筛选） */
export function listPolicies(category) {
  return request.get('/policy/list', { params: category ? { category } : {} })
}
