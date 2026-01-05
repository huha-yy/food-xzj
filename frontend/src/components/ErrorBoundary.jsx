import { Component } from 'react'
import { Result, Button } from 'antd'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status="error"
            title="页面出错了"
            subTitle="抱歉，页面加载过程中出现了问题"
            extra={[
              <Button type="primary" key="back" onClick={() => window.history.back()}>
                返回上一页
              </Button>,
              <Button key="refresh" onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

