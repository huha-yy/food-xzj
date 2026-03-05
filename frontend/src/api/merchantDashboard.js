import request from '@/utils/request'

/**
 * 获取商家自己的菜品列表
 */
export function getMerchantFoodList(params) {
  return request({
    url: '/foods/list',
    method: 'get',
    params
  })
}

/**
 * 创建菜品
 */
export function createFood(data) {
  return request({
    url: '/foods',
    method: 'post',
    data
  })
}

/**
 * 修改菜品
 */
export function updateFood(foodId, data) {
  return request({
    url: `/foods/${foodId}`,
    method: 'put',
    data
  })
}

/**
 * 删除菜品
 */
export function deleteFood(foodId) {
  return request({
    url: `/foods/${foodId}`,
    method: 'delete'
  })
}

/**
 * 菜品上下架
 */
export function updateFoodStatus(foodId, status) {
  return request({
    url: `/foods/${foodId}/status`,
    method: 'put',
    params: { status }
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
 * 获取当前登录商家信息
 */
export function getCurrentMerchant() {
  return request({
    url: '/merchants/current',
    method: 'get'
  })
}

/**
 * 修改商家信息
 */
export function updateMerchantInfo(merchantId, data) {
  return request({
    url: `/merchants/${merchantId}`,
    method: 'put',
    data
  })
}

// ========== 活动管理 ==========

/**
 * 获取商家的活动列表
 */
export function getMerchantActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

/**
 * 创建活动
 */
export function createActivity(data) {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

/**
 * 修改活动
 */
export function updateActivity(data) {
  return request({
    url: '/activity',
    method: 'put',
    data
  })
}

/**
 * 删除活动
 */
export function deleteActivity(id) {
  return request({
    url: `/activity/${id}`,
    method: 'delete'
  })
}

