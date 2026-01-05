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
  DashboardOutlined
} from '@ant-design/icons'
import './Layout.css'

const { Header, Content, Sider } = AntLayout

function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  // 菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/foods',
      icon: <ShopOutlined />,
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
      label: '管理员后台'
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
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div className="logo">
          <h2>美食评价</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header className="header">
          <div className="header-content">
            <h1 className="header-title">校园美食评价系统</h1>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <div className="user-info">
                <Avatar
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  size="large"
                />
                <span className="username">{userInfo.nickname || userInfo.username}</span>
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

