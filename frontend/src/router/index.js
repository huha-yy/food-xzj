import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

// 懒加载组件
const Layout = lazy(() => import('@/layouts/Layout'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const Home = lazy(() => import('@/pages/home/Home'))
const FoodList = lazy(() => import('@/pages/food/FoodList'))
const FoodDetail = lazy(() => import('@/pages/food/FoodDetail'))
const MerchantList = lazy(() => import('@/pages/merchant/MerchantList'))
const MerchantDetail = lazy(() => import('@/pages/merchant/MerchantDetail'))
const ReviewList = lazy(() => import('@/pages/review/ReviewList'))
const ReviewDetail = lazy(() => import('@/pages/review/ReviewDetail'))
const CollectionList = lazy(() => import('@/pages/collection/CollectionList'))
const PersonalCenter = lazy(() => import('@/pages/user/PersonalCenter'))
const MerchantDashboard = lazy(() => import('@/pages/merchant/Dashboard'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'foods',
        element: <FoodList />
      },
      {
        path: 'foods/:id',
        element: <FoodDetail />
      },
      {
        path: 'merchants',
        element: <MerchantList />
      },
      {
        path: 'merchants/:id',
        element: <MerchantDetail />
      },
      {
        path: 'reviews',
        element: <ReviewList />
      },
      {
        path: 'reviews/:id',
        element: <ReviewDetail />
      },
      {
        path: 'collections',
        element: <CollectionList />
      },
      {
        path: 'user',
        element: <PersonalCenter />
      },
      {
        path: 'merchant/dashboard',
        element: <MerchantDashboard />
      },
      {
        path: 'admin/dashboard',
        element: <AdminDashboard />
      }
    ]
  }
])

export default router

