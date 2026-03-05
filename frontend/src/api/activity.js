import request from '@/utils/request'

/**
 * 获取活动列表（公开）
 */
export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

/**
 * 获取活动详情（公开）
 */
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}
