import request from '@/utils/request'

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      userId: userInfo?.userId
    }
  })
}

/**
 * 修改用户信息
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 */
export function updatePassword(oldPassword, newPassword) {
  return request({
    url: '/user/password',
    method: 'put',
    params: {
      oldPassword,
      newPassword
    }
  })
}

