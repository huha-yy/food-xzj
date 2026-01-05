import { useEffect, useState } from 'react'
import { Card, Row, Col, List, Tag, Rate, Button, Empty, Spin, Alert } from 'antd'
import { FireOutlined, ShopOutlined, StarOutlined, HeartOutlined, BellOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getRecommendFoods, getHotFoods } from '@/api/food'
import { getAnnouncementList } from '@/api/announcement'
import './Home.css'

function Home() {
  const [loading, setLoading] = useState(true)
  const [recommendFoods, setRecommendFoods] = useState([])
  const [hotFoods, setHotFoods] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [recommendData, hotData, announcementData] = await Promise.all([
        getRecommendFoods({ limit: 6 }),
        getHotFoods({ limit: 6 }),
        getAnnouncementList({ status: 'PUBLISHED', current: 1, pageSize: 5 })
      ])

      // 后端推荐接口返回的是数组，不是分页对象
      setRecommendFoods(Array.isArray(recommendData) ? recommendData : [])
      setHotFoods(Array.isArray(hotData) ? hotData : [])
      // 公告接口返回的是分页对象，需要取 records
      setAnnouncements(announcementData?.records || [])
    } catch (error) {
      console.error('获取首页数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToFoodDetail = (id) => {
    navigate(`/foods/${id}`)
  }

  const renderFoodCard = (food) => (
    <List.Item key={food.id}>
      <Card
        hoverable
        cover={
          food.imageUrl ? (
            <img
              alt={food.name}
              src={food.imageUrl}
              className="food-image"
            />
          ) : null
        }
        onClick={() => goToFoodDetail(food.id)}
      >
        <Card.Meta
          title={
            <div className="food-title">
              <span>{food.name}</span>
              <Tag color="red">¥{food.price}</Tag>
            </div>
          }
          description={
            <div>
              <div className="food-info">
                <ShopOutlined />
                <span>{food.merchantName}</span>
              </div>
              <div className="food-rating">
                <Rate disabled defaultValue={Number(food.ratingAvg)} allowHalf />
                <span className="rating-count">({food.ratingAvg}分)</span>
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

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="home">
      <div className="page-header">
        <h1>校园美食评价系统</h1>
        <p>发现校园美食，分享美食体验</p>
      </div>

      {/* 公告栏 */}
      {announcements.length > 0 && (
        <Card
          className="announcement-card"
          title={
            <div className="card-title">
              <BellOutlined />
              <span>系统公告</span>
            </div>
          }
        >
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
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* 热门推荐 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="card-title">
                <FireOutlined />
                <span>热门推荐</span>
              </div>
            }
            extra={<Button type="link" onClick={() => navigate('/foods')}>查看更多</Button>}
          >
            {hotFoods.length > 0 ? (
              <List
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2 }}
                dataSource={hotFoods}
                renderItem={renderFoodCard}
              />
            ) : (
              <Empty description="暂无热门菜品" />
            )}
          </Card>
        </Col>

        {/* 分类推荐 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="card-title">
                <StarOutlined />
                <span>分类推荐</span>
              </div>
            }
            extra={<Button type="link" onClick={() => navigate('/foods')}>查看更多</Button>}
          >
            {recommendFoods.length > 0 ? (
              <List
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2 }}
                dataSource={recommendFoods}
                renderItem={renderFoodCard}
              />
            ) : (
              <Empty description="暂无推荐菜品" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home

