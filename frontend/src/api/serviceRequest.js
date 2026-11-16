import request from './request'

/** 村民提交诉求（farmer_id 由后端从 token 解析，前端不传，防止篡改） */
export function submitServiceRequest(data) {
  return request.post('/service-request/submit', data)
}

/** 我的办事记录（后端强制 where farmer_id = 当前登录农户） */
export function listMyServiceRequests() {
  return request.get('/service-request/my-list')
}

/** 管理员：全村诉求列表（可按状态筛选） */
export function listAllServiceRequests(status) {
  return request.get('/service-request/admin/list', { params: status ? { status } : {} })
}

/** 管理员：回复 + 更新处理状态 */
export function replyServiceRequest(id, data) {
  return request.put(`/service-request/admin/reply/${id}`, data)
}
