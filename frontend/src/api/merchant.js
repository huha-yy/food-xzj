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

