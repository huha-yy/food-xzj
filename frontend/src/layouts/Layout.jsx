import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown, message } from 'antd'
import {
  HomeOutlined,
  ShopOutlined,
  StarOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  CoffeeOutlined
} from '@ant-design/icons'
import './Layout.css'

const { Header, Content, Sider } = AntLayout

function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  // 角色显示映射
  const roleMap = {
    STUDENT: '学生',
    MERCHANT: '商家',
    ADMIN: '管理员'
  }

  // 菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/foods',
      icon: <CoffeeOutlined />,
      label: '菜品'
    },
    {
      key: '/merchants',
      icon: <ShopOutlined />,
      label: '商家'
    },
    {
      key: '/reviews',
      icon: <StarOutlined />,
      label: '评价'
    },
    {
      key: '/collections',
      icon: <HeartOutlined />,
      label: '收藏'
    },
    ...(userInfo.role === 'MERCHANT' ? [{
      key: '/merchant/dashboard',
      icon: <DashboardOutlined />,
      label: '商家后台'
    }] : []),
    ...(userInfo.role === 'ADMIN' ? [{
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '管理后台'
    }] : []),
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '个人中心'
    }
  ]

  // 菜单点击事件
  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    message.success('退出登录成功')
    navigate('/login')
  }

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/user')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        {/* Logo区域 */}
        {collapsed ? (
          <div className="logo-collapsed">🍜</div>
        ) : (
          <div className="logo">
            <span className="logo-icon">🍜</span>
            <h2>美食评价</h2>
          </div>
        )}

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <AntLayout style={{ marginLeft: collapsed ? 80 : 220 }}>
        <Header className="header">
          <div className="header-content">
            <h1 className="header-title">
              <span className="header-title-icon">🍽️</span>
              校园美食评价系统
            </h1>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <div className="user-info">
                <Avatar
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  size={36}
                  style={{ backgroundColor: '#4096ff' }}
                />
                <div className="user-info-content">
                  <span className="username">{userInfo.nickname || userInfo.username}</span>
                  <span className="user-role">{roleMap[userInfo.role] || '用户'}</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
