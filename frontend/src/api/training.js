import request from './request'

/** 培训课程列表（真实后端） */
export function listTrainingCourses() {
  return request.get('/training-courses')
}
