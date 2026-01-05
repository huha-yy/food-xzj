# 校园美食评价系统 - 前端

基于 React + Vite + Ant Design 的校园美食评价系统前端应用。

## 技术栈

- **React 18.x** - 前端框架
- **Vite 5.x** - 构建工具
- **Ant Design 5.x** - UI组件库
- **React Router 6.x** - 路由管理
- **Axios** - HTTP请求库

## 项目结构

```
src/
├── api/              # API接口
│   ├── auth.js      # 认证相关接口
│   └── food.js      # 菜品相关接口
├── assets/          # 静态资源
│   └── styles/      # 全局样式
│       └── global.css
├── layouts/         # 布局组件
│   ├── Layout.jsx   # 主布局
│   └── Layout.css
├── pages/           # 页面组件
│   ├── auth/        # 认证页面
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Auth.css
│   ├── home/        # 首页
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── food/        # 菜品相关
│   │   ├── FoodList.jsx
│   │   ├── FoodDetail.jsx
│   │   └── FoodList.css
│   ├── merchant/    # 商家相关
│   │   ├── MerchantList.jsx
│   │   ├── MerchantDetail.jsx
│   │   └── Dashboard.jsx
│   ├── review/      # 评价相关
│   │   ├── ReviewList.jsx
│   │   └── ReviewDetail.jsx
│   ├── collection/  # 收藏相关
│   │   └── CollectionList.jsx
│   └── user/       # 用户相关
│       └── PersonalCenter.jsx
├── router/          # 路由配置
│   └── index.js
├── utils/           # 工具函数
│   └── request.js   # Axios封装
├── App.jsx
└── main.jsx
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 功能模块

### 已完成

- ✅ 用户登录
- ✅ 用户注册
- ✅ 首页（热门推荐、分类推荐）
- ✅ 菜品列表（搜索、筛选、排序、分页）
- ✅ 菜品详情（占位）
- ✅ 商家列表（占位）
- ✅ 商家详情（占位）
- ✅ 评价列表（占位）
- ✅ 评价详情（占位）
- ✅ 收藏列表（占位）
- ✅ 个人中心（占位）
- ✅ 商家后台（占位）
- ✅ 管理员后台（占位）

### 开发中

- ⏳ 菜品详情页面
- ⏳ 商家相关页面
- ⏳ 评价和收藏页面
- ⏳ 个人中心页面

## API接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/user/info` - 获取用户信息

### 菜品接口

- `GET /api/food/list` - 获取菜品列表
- `GET /api/recommend/hot` - 获取热门菜品
- `GET /api/recommend/category` - 获取分类推荐
- `GET /api/food/:id` - 获取菜品详情

## 注意事项

1. **后端服务必须先启动**：前端开发依赖后端API，请确保后端服务运行在 `http://localhost:8080`

2. **跨域配置**：已在 `vite.config.js` 中配置代理，自动解决跨域问题

3. **JWT Token**：登录成功后，Token会自动保存在 localStorage 中，后续请求会自动携带 Token

4. **路由懒加载**：所有页面组件都使用懒加载，提升应用性能

## 开发规范

- 使用函数式组件 + Hooks
- 遵循 ESLint 代码规范
- 组件文件名使用 PascalCase
- 样式文件名与组件文件名一致

## 浏览器支持

- Chrome (推荐)
- Firefox
- Edge
- Safari

## 许可证

MIT
