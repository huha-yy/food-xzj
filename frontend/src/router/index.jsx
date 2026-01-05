import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import lazyLoad from '@/utils/lazyLoad.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(lazy(() => import('@/pages/auth/Login')))
  },
  {
    path: '/register',
    element: lazyLoad(lazy(() => import('@/pages/auth/Register')))
  },
  {
    path: '/',
    element: lazyLoad(lazy(() => import('@/layouts/Layout'))),
    children: [
      {
        index: true,
        element: lazyLoad(lazy(() => import('@/pages/home/Home')))
      },
      {
        path: 'foods',
        element: lazyLoad(lazy(() => import('@/pages/food/FoodList')))
      },
      {
        path: 'foods/:id',
        element: lazyLoad(lazy(() => import('@/pages/food/FoodDetail')))
      },
      {
        path: 'merchants',
        element: lazyLoad(lazy(() => import('@/pages/merchant/MerchantList')))
      },
      {
        path: 'merchants/:id',
        element: lazyLoad(lazy(() => import('@/pages/merchant/MerchantDetail')))
      },
      {
        path: 'reviews',
        element: lazyLoad(lazy(() => import('@/pages/review/ReviewList')))
      },
      {
        path: 'reviews/:id',
        element: lazyLoad(lazy(() => import('@/pages/review/ReviewDetail')))
      },
      {
        path: 'collections',
        element: lazyLoad(lazy(() => import('@/pages/collection/CollectionList')))
      },
      {
        path: 'user',
        element: lazyLoad(lazy(() => import('@/pages/user/PersonalCenter')))
      },
      {
        path: 'merchant/dashboard',
        element: lazyLoad(lazy(() => import('@/pages/merchant/Dashboard')))
      },
      {
        path: 'admin/dashboard',
        element: lazyLoad(lazy(() => import('@/pages/admin/Dashboard')))
      }
    ]
  }
])

export default router
