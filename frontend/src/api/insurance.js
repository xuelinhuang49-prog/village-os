import request from './request'

/** 我的医保养老（后端按 farmer_id 行级过滤） */
export function listInsurance() {
  return request.get('/insurances')
}
