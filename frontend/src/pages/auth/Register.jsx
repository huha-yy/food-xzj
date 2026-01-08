import { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/auth'
import './Auth.css'

const { Option } = Select

// 美食装饰图标
const foodIcons = ['🍜', '🍕', '🍔', '🍣', '🍰', '🥗', '🍲', '🧁']

function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const { username, password, confirmPassword, role, phone } = values

      if (password !== confirmPassword) {
        message.error('两次密码输入不一致')
        return
      }

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
            加入我们<br />
            开启你的美食探索之旅
          </p>

          {/* 特色标签 */}
          <div className="auth-features">
            <div className="auth-feature-tag">
              <span>📝</span>
              <span>发表评价</span>
            </div>
            <div className="auth-feature-tag">
              <span>🏆</span>
              <span>榜单推荐</span>
            </div>
            <div className="auth-feature-tag">
              <span>🎁</span>
              <span>专属优惠</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form-title">创建账号</h2>
            <p className="auth-form-desc">注册成为美食探索者</p>
          </div>

          <Form
            name="register"
            className="auth-form"
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
              <Select placeholder="请选择角色">
                <Option value="STUDENT">🎓 学生</Option>
                <Option value="MERCHANT">🏪 商家</Option>
                <Option value="ADMIN">⚙️ 管理员</Option>
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
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                注 册
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <span>已有账号？</span>
            <Button type="link" onClick={goToLogin}>
              立即登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
