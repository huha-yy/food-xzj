import { useEffect, useState } from 'react'
import { Card, Row, Col, List, Tag, Rate, Button, Empty, Spin, Input, Tabs, Skeleton, Segmented, Pagination } from 'antd'
import { SearchOutlined, FireOutlined, ShopOutlined, StarOutlined, BellOutlined, AppstoreOutlined, CoffeeOutlined, SmileOutlined, GiftOutlined, CalendarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getRecommendFoods, getHotFoods, getFoodList } from '@/api/food'
import { getCategoryList } from '@/api/category'
import { getAnnouncementList } from '@/api/announcement'
import { getActivityList } from '@/api/activity'
import './Home.css'

const { Search } = Input

function Home() {
  const [loading, setLoading] = useState(true)
  const [recommendFoods, setRecommendFoods] = useState([])
  const [hotFoods, setHotFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [activities, setActivities] = useState([])
  const [infoType, setInfoType] = useState('announcement')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('hot')
  const navigate = useNavigate()

  // 公告和活动分页
  const [announcementPage, setAnnouncementPage] = useState(1)
  const [announcementTotal, setAnnouncementTotal] = useState(0)
  const [activityPage, setActivityPage] = useState(1)
  const [activityTotal, setActivityTotal] = useState(0)
  const [infoLoading, setInfoLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchKeyword) {
      handleSearch(searchKeyword)
    } else if (selectedCategory) {
      handleCategoryClick(selectedCategory)
    }
  }, [searchKeyword, selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [recommendData, hotData, categoryData, announcementData, activityData] = await Promise.all([
        getRecommendFoods({ limit: 6 }),
        getHotFoods({ limit: 6 }),
        getCategoryList(),
        getAnnouncementList({ status: 'PUBLISHED', current: 1, pageSize: 5 }),
        getActivityList({ auditStatus: 'APPROVED', current: 1, pageSize: 5 })
      ])

      setRecommendFoods(Array.isArray(recommendData) ? recommendData : [])
      setHotFoods(Array.isArray(hotData) ? hotData : [])
      setCategories(Array.isArray(categoryData) ? categoryData : [])
      setAnnouncements(announcementData?.records || [])
      setAnnouncementTotal(announcementData?.total || 0)
      setActivities(activityData?.records || [])
      setActivityTotal(activityData?.total || 0)
    } catch (error) {
      console.error('获取首页数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnnouncements = async (page = 1) => {
    try {
      setInfoLoading(true)
      const data = await getAnnouncementList({ status: 'PUBLISHED', current: page, pageSize: 5 })
      setAnnouncements(data?.records || [])
      setAnnouncementTotal(data?.total || 0)
      setAnnouncementPage(page)
    } catch (error) {
      console.error('获取公告失败:', error)
    } finally {
      setInfoLoading(false)
    }
  }

  const fetchActivities = async (page = 1) => {
    try {
      setInfoLoading(true)
      const data = await getActivityList({ auditStatus: 'APPROVED', current: page, pageSize: 5 })
      setActivities(data?.records || [])
      setActivityTotal(data?.total || 0)
      setActivityPage(page)
    } catch (error) {
      console.error('获取活动失败:', error)
    } finally {
      setInfoLoading(false)
    }
  }

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setActiveTab('hot')
      return
    }

    try {
      setLoading(true)
      const data = await getFoodList({ keyword, current: 1, pageSize: 6 })
      setRecommendFoods(data?.records || [])
      setActiveTab('search')
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = async (categoryId) => {
    if (selectedCategory === categoryId) {
      // 取消选择，返回热门推荐
      setSelectedCategory(null)
      setSearchKeyword('')
      setActiveTab('hot')
      return
    }

    try {
      setLoading(true)
      setSelectedCategory(categoryId)
      const data = await getFoodList({ categoryId, current: 1, pageSize: 6 })
      setRecommendFoods(data?.records || [])
      setActiveTab('category')
    } catch (error) {
      console.error('获取分类菜品失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToFoodDetail = (id) => {
    navigate(`/foods/${id}`)
  }

  const renderFoodCard = (food, index) => (
    <List.Item key={`food-${food.id}-${index}`}>
      <Card
        hoverable
        className={`food-card ${!food.imageUrl ? 'no-image' : ''}`}
        cover={
          food.imageUrl ? (
            <img
              alt={food.name}
              src={food.imageUrl}
              className="food-image"
            />
          ) : (
            <div className="food-image-placeholder">
              <CoffeeOutlined className="placeholder-icon" />
              <div className="placeholder-text">
                <span>暂无图片</span>
                <span className="placeholder-hint">点击查看详情</span>
              </div>
            </div>
          )
        }
        onClick={() => goToFoodDetail(food.id)}
      >
        <Card.Meta
          title={
            <div className="food-title">
              <span>{food.name}</span>
              <Tag color="#4096ff">¥{food.price}</Tag>
            </div>
          }
          description={
            <div className="food-description">
              <div className="food-info">
                <ShopOutlined />
                <span>{food.merchantName}</span>
              </div>
              <div className="food-rating">
                <Rate disabled defaultValue={Number(food.ratingAvg) || 0} allowHalf />
                <span className="rating-count">{food.ratingAvg || '0.0'}分</span>
              </div>
              <div className="food-sales">
                <FireOutlined />
                <span>销量: {food.salesCount}</span>
              </div>
            </div>
          }
        />
      </Card>
    </List.Item>
  )

  // 骨架屏
  const renderSkeleton = () => (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
      dataSource={[1, 2, 3, 4, 5, 6]}
      renderItem={(item) => (
        <List.Item key={item}>
          <Card>
            <Skeleton.Image active style={{ width: '100%', height: 160 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </List.Item>
      )}
    />
  )

  // 美食装饰图标（减少数量）
  const headerFoodIcons = ['🍜', '🍕']

  return (
    <div className="home">
      {/* 顶部搜索栏 */}
      <div className="home-header">
        {/* 浮动美食装饰 */}
        {headerFoodIcons.map((icon, index) => (
          <span key={index} className="header-food-decoration">
            {icon}
          </span>
        ))}

        <div className="home-header-content">
          <div className="home-header-title">
            <h1>🍽️ 校园美食评价系统</h1>
            <p>发现校园美食，分享美食体验</p>
          </div>
          <div className="home-header-search">
            <Search
              placeholder="搜索菜品名称..."
              enterButton={<SearchOutlined />}
              size="large"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ maxWidth: 500, width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="category-tabs">
        <div className="category-scroll">
          {categories.length > 0 && (
            <>
              <Button
                key="all"
                type={selectedCategory === null ? 'primary' : 'default'}
                className="category-btn"
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchKeyword('')
                  setActiveTab('hot')
                }}
              >
                全部
              </Button>
              {categories.map((category) => (
                <Button
                  key={`category-${category.id}`}
                  type={selectedCategory === category.id ? 'primary' : 'default'}
                  className="category-btn"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="home-content">
        {/* 公告/活动栏 */}
        {(announcements.length > 0 || activities.length > 0) && (
          <Card
            className="announcement-card"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-title">
                  {infoType === 'announcement' ? <BellOutlined /> : <GiftOutlined />}
                  <span>{infoType === 'announcement' ? '系统公告' : '促销活动'}</span>
                </div>
                <Segmented
                  size="small"
                  value={infoType}
                  onChange={(value) => setInfoType(value)}
                  options={[
                    { label: '公告', value: 'announcement' },
                    { label: '活动', value: 'activity' }
                  ]}
                />
              </div>
            }
          >
            <Spin spinning={infoLoading}>
              {infoType === 'announcement' ? (
                <>
                  <List
                    dataSource={announcements}
                    renderItem={(announcement) => (
                      <List.Item key={announcement.id} className="announcement-item">
                        <div className="announcement-content">
                          <div className="announcement-header">
                            <span className="announcement-title">{announcement.title}</span>
                            <span className="announcement-time">
                              {announcement.publishTime
                                ? new Date(announcement.publishTime).toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''}
                            </span>
                          </div>
                          <div className="announcement-text">{announcement.content}</div>
                        </div>
                      </List.Item>
                    )}
                  />
                  {announcementTotal > 5 && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <Pagination
                        simple
                        current={announcementPage}
                        pageSize={5}
                        total={announcementTotal}
                        onChange={(page) => fetchAnnouncements(page)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <List
                    dataSource={activities}
                    renderItem={(activity) => (
                      <List.Item key={activity.id} className="announcement-item" onClick={() => navigate(`/merchants/${activity.merchantId}`)} style={{ cursor: 'pointer' }}>
                        <div className="announcement-content">
                          <div className="announcement-header">
                            <span className="announcement-title">{activity.title}</span>
                            <Tag color="orange">{activity.merchantName}</Tag>
                          </div>
                          <div className="announcement-text">{activity.content}</div>
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CalendarOutlined />
                            {new Date(activity.startTime).toLocaleDateString('zh-CN')} ~ {new Date(activity.endTime).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: '暂无活动' }}
                  />
                  {activityTotal > 5 && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <Pagination
                        simple
                        current={activityPage}
                        pageSize={5}
                        total={activityTotal}
                        onChange={(page) => fetchActivities(page)}
                      />
                    </div>
                  )}
                </>
              )}
            </Spin>
          </Card>
        )}

        {/* 标签页切换 */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            if (key === 'hot') {
              setSelectedCategory(null)
              setSearchKeyword('')
              fetchData()
            }
          }}
          items={[
            {
              key: 'hot',
              label: (
                <span>
                  <FireOutlined />
                  热门推荐
                </span>
              ),
              children: (
                <div key="hot-list">
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={hotFoods}
                    renderItem={renderFoodCard}
                  />
                </div>
              )
            },
            {
              key: 'recommend',
              label: (
                <span>
                  <StarOutlined />
                  智能推荐
                </span>
              ),
              children: (
                <div key="recommend-list">
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={recommendFoods}
                    renderItem={renderFoodCard}
                  />
                </div>
              )
            },
            {
              key: 'search',
              label: '搜索结果',
              children: (
                <div key="search-list">
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={recommendFoods}
                    renderItem={renderFoodCard}
                  />
                </div>
              )
            },
            {
              key: 'category',
              label: '分类结果',
              children: (
                <div key="category-list">
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={recommendFoods}
                    renderItem={renderFoodCard}
                  />
                </div>
              )
            }
          ]}
        />

        {/* 加载状态 */}
        {loading && renderSkeleton()}
      </div>
    </div>
  )
}

export default Home
