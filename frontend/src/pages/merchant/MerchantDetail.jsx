import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Rate, Button, Tag, List, Empty, Spin, Tabs, message } from 'antd'
import {
  ShopOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  StarOutlined,
  HeartOutlined,
  HeartFilled,
  ClockCircleOutlined,
  FireOutlined,
  CoffeeOutlined
} from '@ant-design/icons'
import { getMerchantDetail } from '@/api/merchant'
import { getFoodList } from '@/api/food'
import { createCollection, deleteCollection, checkCollection, getCollectionList } from '@/api/collection'
import './MerchantDetail.css'

function MerchantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState(null)
  const [foods, setFoods] = useState([])
  const [total, setTotal] = useState(0)
  const [activeTab, setActiveTab] = useState('food')
  const [isCollected, setIsCollected] = useState(false)

  useEffect(() => {
    fetchMerchantDetail()
    checkCollectionStatus()
  }, [id])

  useEffect(() => {
    if (merchant && activeTab === 'food') {
      fetchFoodList()
    }
  }, [merchant, activeTab])

  const fetchMerchantDetail = async () => {
    try {
      setLoading(true)
      const data = await getMerchantDetail(id)
      setMerchant(data)
    } catch (error) {
      console.error('获取商家详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFoodList = async () => {
    try {
      const data = await getFoodList({
        merchantId: id,
        current: 1,
        pageSize: 10
      })
      setFoods(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取菜品列表失败:', error)
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  const goToFoodDetail = (foodId) => {
    navigate(`/foods/${foodId}`)
  }

  const checkCollectionStatus = async () => {
    try {
      const result = await checkCollection(id, 'MERCHANT')
      setIsCollected(result === true)
    } catch (error) {
      console.error('检查收藏状态失败:', error)
    }
  }

  const handleCollection = async () => {
    try {
      if (isCollected) {
        // 取消收藏
        const collectionList = await getCollectionList({ type: 'MERCHANT', current: 1, pageSize: 1000 })
        const targetCollection = collectionList?.records?.find(c => c.targetId == id)
        if (targetCollection) {
          await deleteCollection(targetCollection.collectionId)
          message.success('取消收藏成功')
        } else {
          message.warning('未找到收藏记录，可能已被删除')
        }
      } else {
        // 添加收藏
        await createCollection({
          type: 'MERCHANT',
          targetId: id
        })
        message.success('收藏成功')
      }
      // 无论成功失败，都重新检查收藏状态
      await checkCollectionStatus()
    } catch (error) {
      console.error('收藏操作失败:', error)
      // 如果是重复收藏，说明状态不一致，更新为已收藏
      if (error.message?.includes('Duplicate entry') || error.response?.data?.message?.includes('重复')) {
        message.warning('已经收藏过了')
        await checkCollectionStatus()
      } else {
        message.error('操作失败')
      }
    }
  }

  const getAuditStatusConfig = (status) => {
    const config = {
      APPROVED: { text: '已认证', className: 'approved' },
      PENDING: { text: '待审核', className: 'pending' },
      REJECTED: { text: '已驳回', className: 'rejected' }
    }
    return config[status] || { text: status, className: '' }
  }

  const getStatusConfig = (status) => {
    const config = {
      ACTIVE: { text: '营业中', className: 'active' },
      DISABLED: { text: '已停业', className: 'disabled' }
    }
    return config[status] || { text: status, className: '' }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!merchant) {
    return (
      <Empty description="商家不存在" />
    )
  }

  const auditConfig = getAuditStatusConfig(merchant.auditStatus)
  const statusConfig = getStatusConfig(merchant.status)

  return (
    <div className="merchant-detail">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={goBack}
        className="back-btn"
      >
        返回
      </Button>

      {/* 商家主卡片 */}
      <Card className="merchant-main-card">
        <div className="merchant-detail-content">
          {/* 商家头部 */}
          <div className="merchant-header">
            <div className="merchant-logo-wrapper">
              <span className="merchant-logo">🏪</span>
            </div>
            <div className="merchant-info-header">
              <h1 className="shop-name">{merchant.shopName}</h1>
              <div className="merchant-status-tags">
                <Tag className={`status-tag ${auditConfig.className}`}>
                  {auditConfig.text}
                </Tag>
                <Tag className={`status-tag ${statusConfig.className}`}>
                  {statusConfig.text}
                </Tag>
              </div>
            </div>
          </div>

          {/* 商家评分 */}
          <div className="merchant-rating-section">
            <Rate
              disabled
              defaultValue={4.5}
              allowHalf
            />
            <span className="rating-text">4.5分</span>
          </div>

          {/* 商家信息 */}
          <div className="merchant-info-grid">
            <div className="info-item">
              <div className="info-label">
                <EnvironmentOutlined />
                店铺地址
              </div>
              <div className="info-value">
                {merchant.address || '暂无地址'}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">
                <ClockCircleOutlined />
                营业时间
              </div>
              <div className="info-value">
                {merchant.openingHours || '暂无营业时间'}
              </div>
            </div>
          </div>

          {/* 商家描述 */}
          <div className="merchant-description-section">
            <h4>店铺介绍</h4>
            <p className="merchant-description">
              {merchant.description || '暂无描述'}
            </p>
          </div>

          {/* 收藏按钮 */}
          <Button
            type={isCollected ? 'default' : 'primary'}
            icon={isCollected ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleCollection}
            size="large"
            className={`merchant-collection-btn ${isCollected ? 'collected' : ''}`}
          >
            {isCollected ? '已收藏' : '收藏店铺'}
          </Button>
        </div>
      </Card>

      {/* 菜品列表卡片 */}
      <Card className="merchant-content-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'food',
              label: (
                <span>
                  <CoffeeOutlined />
                  菜品列表 ({total})
                </span>
              ),
              children: (
                foods.length > 0 ? (
                  <List
                    grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={foods}
                    renderItem={(food) => (
                      <List.Item key={food.foodId}>
                        <Card
                          hoverable
                          className="merchant-food-card"
                          cover={
                            food.imageUrl ? (
                              <img
                                alt={food.name}
                                src={food.imageUrl}
                                className="food-image"
                              />
                            ) : (
                              <div className="food-image-placeholder">
                                <CoffeeOutlined />
                              </div>
                            )
                          }
                          onClick={() => goToFoodDetail(food.foodId)}
                        >
                          <Card.Meta
                            title={food.name}
                            description={
                              <>
                                <div className="food-info">
                                  <span className="category-name">{food.categoryName}</span>
                                </div>
                                <div className="food-rating">
                                  <Rate disabled defaultValue={Number(food.ratingAvg)} allowHalf />
                                  <span className="rating-count">{food.ratingAvg || '0.0'}分</span>
                                </div>
                                <div className="food-sales">
                                  <FireOutlined />
                                  <span>销量: {food.salesCount}</span>
                                </div>
                              </>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="该商家暂无菜品" />
                )
              )
            },
            {
              key: 'review',
              label: (
                <span>
                  <StarOutlined />
                  用户评价
                </span>
              ),
              children: (
                <Empty description="评价功能开发中..." />
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default MerchantDetail
