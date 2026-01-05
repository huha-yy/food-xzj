import request from '@/utils/request'

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
 * 发表评价
 */
export function createReview(data) {
  return request({
    url: '/reviews',
    method: 'post',
    data
  })
}

/**
 * 删除评价
 */
export function deleteReview(reviewId) {
  return request({
    url: `/reviews/${reviewId}`,
    method: 'delete'
  })
}

/**
 * 点赞评价
 */
export function likeReview(reviewId) {
  return request({
    url: `/reviews/${reviewId}/like`,
    method: 'post'
  })
}

/**
 * 踩评价
 */
export function dislikeReview(reviewId) {
  return request({
    url: `/reviews/${reviewId}/dislike`,
    method: 'post'
  })
}

/**
 * 取消点赞/踩
 */
export function cancelInteraction(reviewId) {
  return request({
    url: `/reviews/${reviewId}/interaction`,
    method: 'delete'
  })
}

/**
 * 获取评价统计数据
 */
export function getReviewStatistics() {
  return request({
    url: '/reviews/statistics',
    method: 'get'
  })
}

