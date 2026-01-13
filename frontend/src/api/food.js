import request from '@/utils/request'

/**
 * 获取菜品列表
 */
export function getFoodList(params) {
  return request({
    url: '/foods/list',
    method: 'get',
    params
  })
}

/**
 * 获取热门菜品
 */
export function getHotFoods(params) {
  return request({
    url: '/recommend/hot',
    method: 'get',
    params
  })
}

/**
 * 获取个性化推荐（智能推荐）
 */
export function getRecommendFoods(params) {
  return request({
    url: '/recommend/personalized',
    method: 'get',
    params
  })
}

/**
 * 获取分类推荐
 */
export function getCategoryRecommend(params) {
  return request({
    url: '/recommend/category',
    method: 'get',
    params
  })
}

/**
 * 获取菜品详情
 */
export function getFoodDetail(id) {
  return request({
    url: `/foods/${id}`,
    method: 'get'
  })
}

