import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Rate, Button, Tag, List, Avatar, Empty, Spin, Tabs, message } from 'antd'
import { ShopOutlined, EnvironmentOutlined, ArrowLeftOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons'
import { getMerchantDetail } from '@/api/merchant'
import { getFoodList } from '@/api/food'
import { createCollection, deleteCollection, checkCollection, getCollectionList } from '@/api/collection'
import './MerchantDetail.css'

const { TabPane } = Tabs

function MerchantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState(null)
  const [foods, setFoods] = useState([])
  const [total, setTotal] = useState(0)
  const [activeTab, setActiveTab] = useState('food')
  const [isCollected, setIsCollected] = useState(false)
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

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

  return (
    <div className="merchant-detail">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={goBack}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Card
        title="商家详情"
        className="merchant-info-card"
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="店铺名称">
            <span className="shop-name">{merchant.shopName}</span>
          </Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Tag color={
              merchant.auditStatus === 'APPROVED' ? 'green' :
              merchant.auditStatus === 'PENDING' ? 'orange' : 'red'
            }>
              {merchant.auditStatus === 'APPROVED' ? '已审核' :
                merchant.auditStatus === 'PENDING' ? '待审核' : '已驳回'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="店铺状态">
            <Tag color={merchant.status === 'ACTIVE' ? 'green' : 'red'}>
              {merchant.status === 'ACTIVE' ? '营业中' : '已禁用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="地址">
            <span className="merchant-address">
              <EnvironmentOutlined />
              {merchant.address || '暂无地址'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="营业时间">
            <span className="business-hours">
              <ShopOutlined />
              {merchant.openingHours || '暂无营业时间'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="评分" span={2}>
            <Rate
              disabled
              defaultValue={4}
              allowHalf
              style={{ fontSize: 16 }}
            />
            <span className="rating-text">4.5分</span>
          </Descriptions.Item>
          <Descriptions.Item label="店铺描述" span={2}>
            <p className="merchant-description">
              {merchant.description || '暂无描述'}
            </p>
          </Descriptions.Item>
        </Descriptions>

        {/* 收藏按钮 */}
        <Button
          type={isCollected ? 'default' : 'primary'}
          icon={<HeartOutlined />}
          onClick={handleCollection}
          size="large"
          style={{ marginTop: 16 }}
        >
          {isCollected ? '已收藏' : '收藏'}
        </Button>
      </Card>

      <Card className="content-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`菜品列表 (${total})`} key="food">
            {foods.length > 0 ? (
              <List
                grid={{ gutter: [24, 24], xs: 1, sm: 2, md: 3, lg: 4 }}
                dataSource={foods}
                renderItem={(food) => (
                  <List.Item key={food.foodId}>
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
                      onClick={() => goToFoodDetail(food.foodId)}
                    >
                      <Card.Meta
                        title={
                          <span>{food.name}</span>
                        }
                        description={
                          <>
                            <div className="food-info">
                              <span className="category-name">{food.categoryName}</span>
                            </div>
                            <div className="food-rating">
                              <Rate disabled defaultValue={Number(food.ratingAvg)} allowHalf />
                              <span className="rating-count">{food.ratingAvg}分</span>
                            </div>
                            <div className="food-sales">
                              <StarOutlined />
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
            )}
          </TabPane>
          <TabPane tab="评价列表" key="review">
            <Empty description="评价功能开发中..." />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default MerchantDetail
