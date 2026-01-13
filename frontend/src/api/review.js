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

/**
 * 获取评分分布统计
 */
export function getRatingDistribution(foodId) {
  return request({
    url: '/reviews/rating-distribution',
    method: 'get',
    params: { foodId }
  })
}

/**
 * 创建商家回复
 */
export function createReviewReply(data) {
  return request({
    url: '/review-replies',
    method: 'post',
    data
  })
}

/**
 * 删除商家回复
 */
export function deleteReviewReply(replyId) {
  return request({
    url: `/review-replies/${replyId}`,
    method: 'delete'
  })
}

/**
 * 根据评价ID获取回复
 */
export function getReplyByReviewId(reviewId) {
  return request({
    url: `/review-replies/review/${reviewId}`,
    method: 'get'
  })
}

/**
 * 获取所有评价标签
 */
export function getAllReviewTags() {
  return request({
    url: '/review-tags/all',
    method: 'get'
  })
}

/**
 * 根据评价ID获取标签
 */
export function getTagsByReviewId(reviewId) {
  return request({
    url: `/review-tags/review/${reviewId}`,
    method: 'get'
  })
}

