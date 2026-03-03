import request from '@/utils/request'

/**
 * 获取统计数据
 */
export function getStatistics() {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}

/**
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(userId) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { userId }
  })
}

/**
 * 禁用/启用用户
 */
export function updateUserStatus(userId, status) {
  return request({
    url: '/user/status',
    method: 'put',
    params: { userId, status }
  })
}

/**
 * 获取商家列表
 */
export function getMerchantList(params) {
  return request({
    url: '/merchants/list',
    method: 'get',
    params
  })
}

/**
 * 获取商家信息
 */
export function getMerchantInfo(merchantId) {
  return request({
    url: `/merchants/${merchantId}`,
    method: 'get'
  })
}

/**
 * 审核商家
 */
export function auditMerchant(data) {
  return request({
    url: '/merchants/audit',
    method: 'post',
    data
  })
}

/**
 * 修改商家状态
 */
export function updateMerchantStatus(merchantId, status) {
  return request({
    url: `/merchants/${merchantId}/status`,
    method: 'put',
    params: { status }
  })
}

/**
 * 获取评价列表
 */
export function getReviewList(params) {
  return request({
    url: '/reviews/list',
    method: 'get',
    params
  })
}

/**
 * 获取评价详情
 */
export function getReviewDetail(reviewId) {
  return request({
    url: `/reviews/${reviewId}`,
    method: 'get'
  })
}

/**
 * 审核评价
 */
export function auditReview(data) {
  return request({
    url: '/reviews/audit',
    method: 'post',
    data
  })
}

/**
 * 删除评价（管理员）
 */
export function deleteReview(reviewId) {
  return request({
    url: `/reviews/${reviewId}`,
    method: 'delete'
  })
}

/**
 * 获取公告列表
 */
export function getAnnouncementList(params) {
  return request({
    url: '/announcement/list',
    method: 'get',
    params
  })
}

/**
 * 获取公告详情
 */
export function getAnnouncementDetail(id) {
  return request({
    url: `/announcement/${id}`,
    method: 'get'
  })
}

/**
 * 创建公告
 */
export function createAnnouncement(data) {
  return request({
    url: '/announcement',
    method: 'post',
    data
  })
}

/**
 * 修改公告
 */
export function updateAnnouncement(data) {
  return request({
    url: '/announcement',
    method: 'put',
    data
  })
}

/**
 * 删除公告
 */
export function deleteAnnouncement(id) {
  return request({
    url: `/announcement/${id}`,
    method: 'delete'
  })
}

/**
 * 发布公告
 */
export function publishAnnouncement(id) {
  return request({
    url: `/announcement/publish/${id}`,
    method: 'post'
  })
}

/**
 * 获取活动列表
 */
export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

/**
 * 获取活动详情
 */
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

/**
 * 审核活动
 */
export function auditActivity(data) {
  return request({
    url: '/activity/audit',
    method: 'post',
    data
  })
}

