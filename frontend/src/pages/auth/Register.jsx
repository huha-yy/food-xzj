import { useState } from 'react'
import { Form, Input, Button, Card, message, Space, Select } from 'antd'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/auth'
import './Auth.css'

const { Option } = Select

function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      setLoading(true)

      const { username, password, confirmPassword, role, phone } = values

      // 验证密码
      if (password !== confirmPassword) {
        message.error('两次密码输入不一致')
        return
      }

      // 调用注册接口
      await register({ username, password, role, phone })

      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="auth-container">
      <Card className="auth-card" title="用户注册" variant="borderless">
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名（3-20个字符）"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（6-20个字符）"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码输入不一致'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="STUDENT"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色" size="large">
              <Option value="STUDENT">学生</Option>
              <Option value="MERCHANT">商家</Option>
              <Option value="ADMIN">管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                注册
              </Button>

              <div className="auth-footer">
                <span>已有账号？</span>
                <Button type="link" onClick={goToLogin}>
                  立即登录
                </Button>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register

