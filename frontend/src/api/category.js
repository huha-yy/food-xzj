import request from '@/utils/request'

/**
 * 获取所有分类列表
 */
export function getCategoryList() {
  return request({
    url: '/categories/list',
    method: 'get'
  })
}

/**
 * 获取分类详情
 */
export function getCategoryInfo(categoryId) {
  return request({
    url: `/categories/${categoryId}`,
    method: 'get'
  })
}

