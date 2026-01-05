import { Suspense } from 'react'
import { Spin } from 'antd'

// 懒加载组件包装器
const lazyLoad = (Component) => {
  return (
    <Suspense
      fallback={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
          gap: '16px'
        }}>
          <Spin size="large" />
          <div>加载中...</div>
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}

export default lazyLoad

