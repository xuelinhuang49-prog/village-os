import request from './request'

/** 我的作物档案（后端按 farmer_id 行级过滤） */
export function listCrop() {
  return request.get('/crops')
}
