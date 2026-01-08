import { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '@/api/auth'
import './Auth.css'

const { Option } = Select

// 美食装饰图标
const foodIcons = ['🍜', '🍕', '🍔', '🍣', '🍰', '🥗', '🍲', '🧁']

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const { username, password, role } = values
      const response = await login({ username, password, role })

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
      {/* 左侧品牌展示区 */}
      <div className="auth-left">
        {/* 浮动美食装饰 */}
        {foodIcons.map((icon, index) => (
          <span key={index} className="food-decoration">
            {icon}
          </span>
        ))}

        <div className="auth-brand">
          <div className="auth-brand-icon">
            <span className="food-icon-animated">🍜</span>
          </div>
          <h1 className="auth-brand-text">校园美食评价</h1>
          <p className="auth-brand-subtitle">
            发现校园里的美味<br />
            分享你的味蕾体验
          </p>

          {/* 特色标签 */}
          <div className="auth-features">
            <div className="auth-feature-tag">
              <span>🔍</span>
              <span>发现美食</span>
            </div>
            <div className="auth-feature-tag">
              <span>⭐</span>
              <span>真实评价</span>
            </div>
            <div className="auth-feature-tag">
              <span>❤️</span>
              <span>收藏分享</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form-title">欢迎回来</h2>
            <p className="auth-form-desc">登录你的账号，继续探索美食</p>
          </div>

          <Form
            name="login"
            className="auth-form"
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

            <Form.Item
              name="role"
              initialValue="STUDENT"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="STUDENT">🎓 学生</Option>
                <Option value="MERCHANT">🏪 商家</Option>
                <Option value="ADMIN">⚙️ 管理员</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <span>还没有账号？</span>
            <Button type="link" onClick={goToRegister}>
              立即注册
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
