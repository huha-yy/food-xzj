import { useEffect, useState } from 'react'
import { Card, Row, Col, List, Tag, Rate, Button, Empty, Spin } from 'antd'
import { FireOutlined, ShopOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getRecommendFoods, getHotFoods } from '@/api/food'
import './Home.css'

function Home() {
  const [loading, setLoading] = useState(true)
  const [recommendFoods, setRecommendFoods] = useState([])
  const [hotFoods, setHotFoods] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [recommendData, hotData] = await Promise.all([
        getRecommendFoods({ pageSize: 6 }),
        getHotFoods({ pageSize: 6 })
      ])

      setRecommendFoods(recommendData?.records || [])
      setHotFoods(hotData?.records || [])
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
    <List.Item key={food.foodId}>
      <Card
        hoverable
        cover={
          food.foodImage ? (
            <img
              alt={food.foodName}
              src={food.foodImage}
              className="food-image"
            />
          ) : null
        }
        onClick={() => goToFoodDetail(food.foodId)}
      >
        <Card.Meta
          title={
            <div className="food-title">
              <span>{food.foodName}</span>
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
                <Rate disabled defaultValue={food.averageRating} allowHalf />
                <span className="rating-count">({food.reviewCount}条评价)</span>
              </div>
              <div className="food-sales">
                <FireOutlined />
                <span>销量: {food.sales}</span>
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

