import { useState } from 'react'
import { Modal, Form, Input, Rate, Upload, Button, message, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { createReview } from '@/api/review'
import { uploadImage } from '@/api/upload'

const { TextArea } = Input

function ReviewModal({ visible, foodId, foodName, onCancel, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)

      // 构造评价数据
      const reviewData = {
        foodId: foodId,
        content: values.content,
        rating: values.rating,
        imageUrls: fileList.map(file => file.url).filter(url => url) // 使用imageUrls字段
      }

      // 发表评价
      await createReview(reviewData)

      message.success('评价发表成功')
      form.resetFields()
      setFileList([])
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
    onCancel && onCancel()
  }

  // 自定义上传
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const data = await uploadImage(file)
      const url = data.url

      // 将URL添加到file对象中
      onSuccess({
        ...file,
        status: 'done',
        url: url
      })
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

