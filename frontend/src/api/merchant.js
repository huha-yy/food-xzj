import request from '@/utils/request'

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
 * 获取商家详情
 */
export function getMerchantDetail(merchantId) {
  return request({
    url: `/merchants/${merchantId}`,
    method: 'get'
  })
}

/**
 * 商家入驻申请
 */
export function applyMerchant(data) {
  return request({
    url: '/merchants',
    method: 'post',
    data
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

