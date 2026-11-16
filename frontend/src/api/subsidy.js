import request from './request'

/** 我的惠农补贴（后端按 farmer_id 行级过滤） */
export function listSubsidy() {
  return request.get('/subsidies')
}
