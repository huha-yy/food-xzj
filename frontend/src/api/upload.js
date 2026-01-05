import request from '@/utils/request'

/**
 * 上传图片
 */
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 删除图片
 */
export function deleteImage(imageUrl) {
  return request({
    url: '/upload/image',
    method: 'delete',
    params: { imageUrl }
  })
}

