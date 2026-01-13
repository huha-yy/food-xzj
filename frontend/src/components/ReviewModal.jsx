import { useState, useEffect } from 'react'
import { Modal, Form, Input, Rate, Upload, Button, message, Space, Checkbox, Tag } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { createReview, getAllReviewTags } from '@/api/review'
import { uploadImage } from '@/api/upload'

const { TextArea } = Input

function ReviewModal({ visible, foodId, foodName, onCancel, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (visible) {
      fetchTags()
    }
  }, [visible])

  const fetchTags = async () => {
    try {
      const data = await getAllReviewTags()
      setTags(data || [])
    } catch (error) {
      console.error('获取标签失败:', error)
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)

      // 构造评价数据
      const reviewData = {
        foodId: foodId,
        content: values.content,
        rating: values.rating,
        // 从 file.response 中提取图片 URL
        imageUrls: fileList
          .map(file => file.response?.url || file.response?.imageUrl || file.url)
          .filter(url => url),
        tagIds: selectedTags // 添加标签ID
      }

      console.log('提交评价数据:', reviewData)
      console.log('fileList:', fileList)

      // 发表评价
      await createReview(reviewData)

      message.success('评价发表成功')
      form.resetFields()
      setFileList([])
      setSelectedTags([])
      onSuccess && onSuccess()
    } catch (error) {
      console.error('发表评价失败:', error)
      message.error('发表评价失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setSelectedTags([])
    onCancel && onCancel()
  }

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  // 自定义上传
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const data = await uploadImage(file)
      // 正确调用 onSuccess，第一个参数是响应数据，第二个参数是 file 对象
      onSuccess(data, file)
    } catch (error) {
      console.error('上传失败:', error)
      message.error('图片上传失败')
      onError(error)
    }
  }

  const uploadProps = {
    listType: 'picture',
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-2)) // 最多2张图片
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('只能上传JPG/PNG格式的图片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片大小不能超过2MB!')
        return false
      }
      return true // 返回true才会上传
    },
    customRequest: handleUpload // 自定义上传行为
  }

  return (
    <Modal
      title={`发表评价 - ${foodName}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          rating: 5
        }}
      >
        <Form.Item
          label="评分"
          name="rating"
          rules={[{ required: true, message: '请选择评分' }]}
        >
          <Rate style={{ fontSize: 24 }} />
        </Form.Item>

        <Form.Item
          label="评价内容"
          name="content"
          rules={[
            { required: true, message: '请输入评价内容' },
            { min: 10, message: '评价内容至少10个字符' },
            { max: 500, message: '评价内容不能超过500个字符' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="说说这道菜怎么样吧..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="评价标签"
          name="tags"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => (
              <Tag
                key={tag.tagId}
                color={selectedTags.includes(tag.tagId) ? (
                  tag.type === 'POSITIVE' ? 'green' :
                  tag.type === 'NEGATIVE' ? 'red' : 'blue'
                ) : 'default'}
                style={{
                  cursor: 'pointer',
                  padding: '4px 12px',
                  fontSize: '14px'
                }}
                onClick={() => handleTagToggle(tag.tagId)}
              >
                {tag.name}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="上传图片"
          name="images"
        >
          <Upload
            {...uploadProps}
            listType="picture-card"
          >
            <Space direction="vertical" align="center">
              <Button icon={<UploadOutlined />}>上传图片</Button>
              <span style={{ color: '#999', fontSize: 12 }}>
                最多上传2张，每张不超过2MB
              </span>
            </Space>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReviewModal

