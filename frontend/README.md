# 校园美食评价系统 - 前端

## 项目简介

基于React 18.x的大学生校内美食评价系统前端项目。

## 技术栈

- React 18.2.0
- Vite 5.0.8
- React Router 6.21.0
- Ant Design 5.12.0
- Axios 1.6.2

## 项目结构

```
frontend/
├── src/
│   ├── main.jsx                 # 入口文件
│   ├── App.jsx                   # 根组件
│   ├── api/                      # API接口
│   ├── assets/                   # 静态资源
│   ├── components/               # 公共组件
│   ├── pages/                    # 页面组件
│   ├── router/                   # 路由配置
│   └── utils/                    # 工具函数
├── index.html                  # HTML模板
├── package.json                # 依赖配置
└── vite.config.js             # Vite配置
```

## 环境要求

- Node.js 18+
- npm 或 pnpm

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 开发说明

### 端口配置

- 前端开发服务器：5173（可在vite.config.js中修改）
- 后端服务：8080

### 代理配置

前端开发环境通过Vite代理转发请求到后端：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 路径别名

配置了路径别名 `@`，指向 `src` 目录：

```javascript
import { xxx } from '@/api/xxx'
```

## 注意事项

- 使用React Router 6进行路由管理
- 使用Ant Design组件库
- 使用Axios进行HTTP请求
- 状态管理暂未使用，后续根据需要添加

