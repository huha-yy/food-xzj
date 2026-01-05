import { useState } from 'react'
import { Form, Input, Button, Card, message, Tabs, Space, Select } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '@/api/auth'
import './Auth.css'

const { Option } = Select

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // 从登录成功后跳转到之前想访问的页面
  const from = location.state?.from?.pathname || '/'

  const onFinish = async (values) => {
    try {
      setLoading(true)

      const { username, password, role } = values

      // 调用登录接口
      const response = await login({ username, password, role })

      // 保存token和用户信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify({
        userId: response.userId,
        username: response.username,
        nickname: response.nickname,
        role: response.role
      }))

      message.success('登录成功')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToRegister = () => {
    navigate('/register')
  }

  return (
    <div className="auth-container">
      <Card className="auth-card" title="用户登录" variant="borderless">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form.Item
                name="role"
                initialValue="STUDENT"
                rules={[{ required: true, message: '请选择角色' }]}
                style={{ margin: 0 }}
              >
                <Select placeholder="请选择角色" size="large">
                  <Option value="STUDENT">学生</Option>
                  <Option value="MERCHANT">商家</Option>
                  <Option value="ADMIN">管理员</Option>
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登录
              </Button>

              <div className="auth-footer">
                <span>还没有账号？</span>
                <Button type="link" onClick={goToRegister}>
                  立即注册
                </Button>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login

