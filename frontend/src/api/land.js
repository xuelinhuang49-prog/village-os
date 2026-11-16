import request from './request'

/** 我的地块（后端按 farmer_id 行级过滤） */
export function listLand() {
  return request.get('/lands')
}
