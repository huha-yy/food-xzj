import { useState } from 'react'
import { Form, Input, Button, Card, Upload, message, Steps } from 'antd'
import { ShopOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { applyMerchant } from '@/api/merchant'
import { uploadImage } from '@/api/upload'
import './MerchantApply.css'

const { TextArea } = Input
const { Step } = Steps

function MerchantApply() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleCoverUpload = async ({ file }) => {
    try {
      setCoverUploading(true)
      const result = await uploadImage(file)
      setCoverImage(result.imageUrl)
      message.success('封面图上传成功')
    } catch {
      message.error('封面图上传失败')
    } finally {
      setCoverUploading(false)
    }
  }

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true)
      await applyMerchant({ ...values, coverImage })
      setSubmitted(true)
    } catch (error) {
      message.error(error?.message || '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="merchant-apply-page">
        <Card className="apply-card">
          <div className="apply-success">
            <CheckCircleOutlined className="success-icon" />
            <h2>申请已提交</h2>
            <p>您的商家入驻申请已成功提交，请耐心等待管理员审核。</p>
            <p className="hint">审核通过后，您的账号角色将自动切换为商家，届时请重新登录。</p>
            <div className="success-actions">
              <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
              <Button onClick={() => navigate('/user')}>个人中心</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="merchant-apply-page">
      <div className="apply-header">
        <ShopOutlined className="apply-icon" />
        <h1>商家入驻申请</h1>
        <p>填写以下信息，提交申请后等待管理员审核</p>
      </div>

      <Steps className="apply-steps" current={0} items={[
        { title: '填写信息' },
        { title: '等待审核' },
        { title: '入驻成功' },
      ]} />

      <Card className="apply-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="店铺名称"
            name="shopName"
            rules={[
              { required: true, message: '请输入店铺名称' },
              { max: 64, message: '店铺名称不能超过64个字符' }
            ]}
          >
            <Input placeholder="请输入店铺名称" maxLength={64} showCount />
          </Form.Item>

          <Form.Item
            label="店铺地址"
            name="address"
            rules={[{ max: 256, message: '地址不能超过256个字符' }]}
          >
            <Input placeholder="请输入店铺地址，例如：学生食堂1楼A区" maxLength={256} />
          </Form.Item>

          <Form.Item
            label="营业时间"
            name="openingHours"
            rules={[{ max: 64, message: '营业时间不能超过64个字符' }]}
          >
            <Input placeholder="例如：周一至周日 07:00-21:00" maxLength={64} />
          </Form.Item>

          <Form.Item
            label="店铺描述"
            name="description"
            rules={[{ max: 1000, message: '描述不能超过1000个字符' }]}
          >
            <TextArea
              placeholder="请介绍您的店铺特色、主打菜品等..."
              maxLength={1000}
              showCount
              rows={4}
            />
          </Form.Item>

          <Form.Item label="店铺封面图">
            <Upload
              accept="image/jpeg,image/png"
              showUploadList={false}
              customRequest={handleCoverUpload}
              disabled={coverUploading}
            >
              <Button icon={<UploadOutlined />} loading={coverUploading}>
                {coverImage ? '重新上传' : '上传封面图'}
              </Button>
            </Upload>
            {coverImage && (
              <div className="cover-preview">
                <img src={coverImage} alt="封面预览" />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              size="large"
            >
              提交入驻申请
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default MerchantApply
