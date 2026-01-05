import request from '@/utils/request'

/**
 * 获取收藏列表
 */
export function getCollectionList(params) {
  return request({
    url: '/collections/list',
    method: 'get',
    params
  })
}

/**
 * 收藏菜品/商家
 */
export function createCollection(data) {
  return request({
    url: '/collections',
    method: 'post',
    data
  })
}

/**
 * 取消收藏
 */
export function deleteCollection(collectionId) {
  return request({
    url: `/collections/${collectionId}`,
    method: 'delete'
  })
}

/**
 * 检查是否已收藏
 */
export function checkCollection(targetId, type) {
  return request({
    url: '/collections/check',
    method: 'get',
    params: { targetId, type }
  })
}

