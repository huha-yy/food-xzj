import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Rate, Button, Tag, List, Empty, Spin, Tabs, message, Input, Avatar, Image } from 'antd'
import {
  ShopOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  StarOutlined,
  HeartOutlined,
  HeartFilled,
  ClockCircleOutlined,
  FireOutlined,
  CoffeeOutlined,
  MessageOutlined,
  EditOutlined,
  UserOutlined,
  GiftOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { getMerchantDetail } from '@/api/merchant'
import { getFoodList } from '@/api/food'
import { createCollection, deleteCollection, checkCollection, getCollectionList } from '@/api/collection'
import { getReviewList, createReviewReply, deleteReviewReply } from '@/api/review'
import { getActivityList } from '@/api/activity'
import './MerchantDetail.css'

const { TextArea } = Input

function MerchantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState(null)
  const [foods, setFoods] = useState([])
  const [total, setTotal] = useState(0)
  const [activeTab, setActiveTab] = useState('food')
  const [isCollected, setIsCollected] = useState(false)

  // 评价相关
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsTotal, setReviewsTotal] = useState(0)
  const [reviewsPage, setReviewsPage] = useState(1)
  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingReplyId, setEditingReplyId] = useState(null)
  const [editReplyContent, setEditReplyContent] = useState('')

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isMerchant = userInfo?.role === 'MERCHANT'
  const isOwnMerchant = isMerchant && userInfo?.merchantId == id

  // 活动相关
  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [activitiesTotal, setActivitiesTotal] = useState(0)

  useEffect(() => {
    fetchMerchantDetail()
    checkCollectionStatus()
    fetchReviewCount()
  }, [id])

  const fetchReviewCount = async () => {
    try {
      const data = await getReviewList({ merchantId: id, current: 1, pageSize: 1, auditStatus: 'APPROVED' })
      setReviewsTotal(data?.total || 0)
    } catch (error) {
      console.error('获取评价数量失败:', error)
    }
  }

  useEffect(() => {
    if (merchant && activeTab === 'food') {
      fetchFoodList()
    }
  }, [merchant, activeTab])

  useEffect(() => {
    if (activeTab === 'review') {
      fetchReviews(1)
    }
    if (activeTab === 'activity') {
      fetchActivities(1)
    }
  }, [activeTab])

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

  const fetchReviews = async (page = 1) => {
    try {
      setReviewsLoading(true)
      const data = await getReviewList({ merchantId: id, current: page, pageSize: 5, auditStatus: 'APPROVED' })
      setReviews(data?.records || [])
      setReviewsTotal(data?.total || 0)
      setReviewsPage(page)
    } catch (error) {
      message.error('获取评价列表失败')
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchActivities = async (page = 1) => {
    try {
      setActivitiesLoading(true)
      const data = await getActivityList({ merchantId: id, current: page, pageSize: 5, auditStatus: 'APPROVED' })
      setActivities(data?.records || [])
      setActivitiesTotal(data?.total || 0)
    } catch (error) {
      message.error('获取活动列表失败')
    } finally {
      setActivitiesLoading(false)
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyContent.trim()) {
      message.error('请输入回复内容')
      return
    }
    try {
      await createReviewReply({ reviewId, content: replyContent })
      message.success('回复成功')
      setReplyingReviewId(null)
      setReplyContent('')
      fetchReviews(reviewsPage)
    } catch (error) {
      message.error('回复失败')
    }
  }

  const handleEditReply = async (replyId, reviewId) => {
    if (!editReplyContent.trim()) {
      message.error('请输入回复内容')
      return
    }
    try {
      await deleteReviewReply(replyId)
      await createReviewReply({ reviewId, content: editReplyContent })
      message.success('修改成功')
      setEditingReplyId(null)
      setEditReplyContent('')
      fetchReviews(reviewsPage)
    } catch (error) {
      message.error('修改失败')
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
                  用户评价{reviewsTotal > 0 ? ` (${reviewsTotal})` : ''}
                </span>
              ),
              children: (
                <Spin spinning={reviewsLoading}>
                  {reviews.length === 0 && !reviewsLoading ? (
                    <Empty description="暂无评价" />
                  ) : (
                    <>
                      {reviews.map(review => (
                        <Card key={review.reviewId} style={{ marginBottom: 12 }} size="small">
                          <div style={{ display: 'flex', gap: 12 }}>
                            <Avatar icon={<UserOutlined />} src={review.avatar} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 500 }}>{review.username}</span>
                                <span style={{ color: '#999', fontSize: 12 }}>{review.foodName}</span>
                                <Rate disabled value={review.rating} style={{ fontSize: 12 }} />
                              </div>
                              <p style={{ margin: '4px 0', color: '#555' }}>{review.content}</p>
                              {review.imageUrls && review.imageUrls.length > 0 && (
                                <Image.PreviewGroup>
                                  {review.imageUrls.map((url, idx) => (
                                    <Image key={idx} src={url} width={60} height={60} style={{ objectFit: 'cover', marginRight: 6, borderRadius: 4 }} />
                                  ))}
                                </Image.PreviewGroup>
                              )}
                              <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{review.createTime}</div>

                              {/* 商家回复 */}
                              {review.reply && (
                                <div style={{ marginTop: 12 }}>
                                  {editingReplyId === review.reply.replyId ? (
                                    <>
                                      <TextArea
                                        rows={2}
                                        value={editReplyContent}
                                        onChange={(e) => setEditReplyContent(e.target.value)}
                                        maxLength={500}
                                      />
                                      <div style={{ marginTop: 8, textAlign: 'right' }}>
                                        <Button size="small" onClick={() => { setEditingReplyId(null); setEditReplyContent('') }} style={{ marginRight: 8 }}>取消</Button>
                                        <Button type="primary" size="small" onClick={() => handleEditReply(review.reply.replyId, review.reviewId)}>保存</Button>
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                                      <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#1677ff' }}>
                                        <ShopOutlined /> {review.reply.shopName} 回复：
                                      </div>
                                      <div>{review.reply.content}</div>
                                      <div style={{ fontSize: 12, color: '#999', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{review.reply.createTime}</span>
                                        {isOwnMerchant && (
                                          <Button type="link" size="small" icon={<EditOutlined />} style={{ padding: 0 }} onClick={() => { setEditingReplyId(review.reply.replyId); setEditReplyContent(review.reply.content) }}>修改</Button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 回复入口 */}
                              {isOwnMerchant && !review.reply && replyingReviewId !== review.reviewId && (
                                <Button type="link" size="small" icon={<MessageOutlined />} style={{ padding: 0, marginTop: 8 }} onClick={() => setReplyingReviewId(review.reviewId)}>回复</Button>
                              )}

                              {/* 回复输入框 */}
                              {replyingReviewId === review.reviewId && (
                                <div style={{ marginTop: 12 }}>
                                  <TextArea
                                    rows={2}
                                    placeholder="输入回复内容..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    maxLength={500}
                                    showCount
                                  />
                                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                                    <Button size="small" onClick={() => { setReplyingReviewId(null); setReplyContent('') }} style={{ marginRight: 8 }}>取消</Button>
                                    <Button type="primary" size="small" onClick={() => handleReply(review.reviewId)}>发送</Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ color: '#999', fontSize: 13 }}>共 {reviewsTotal} 条评价</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button size="small" disabled={reviewsPage <= 1} onClick={() => fetchReviews(reviewsPage - 1)}>上一页</Button>
                          <span style={{ lineHeight: '24px', fontSize: 13 }}>第 {reviewsPage} 页</span>
                          <Button size="small" disabled={reviewsPage * 5 >= reviewsTotal} onClick={() => fetchReviews(reviewsPage + 1)}>下一页</Button>
                        </div>
                      </div>
                    </>
                  )}
                </Spin>
              )
            },
            {
              key: 'activity',
              label: (
                <span>
                  <GiftOutlined />
                  促销活动{activitiesTotal > 0 ? ` (${activitiesTotal})` : ''}
                </span>
              ),
              children: (
                <Spin spinning={activitiesLoading}>
                  {activities.length === 0 && !activitiesLoading ? (
                    <Empty description="暂无活动" />
                  ) : (
                    <>
                      {activities.map(activity => (
                        <Card key={activity.id} style={{ marginBottom: 12 }} size="small">
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ fontWeight: 500, fontSize: 16 }}>{activity.title}</span>
                          </div>
                          <p style={{ margin: '8px 0', color: '#555' }}>{activity.content}</p>
                          {activity.imageUrls && activity.imageUrls.length > 0 && (
                            <Image.PreviewGroup>
                              {activity.imageUrls.map((url, idx) => (
                                <Image key={idx} src={url} width={80} height={80} style={{ objectFit: 'cover', marginRight: 8, borderRadius: 4 }} />
                              ))}
                            </Image.PreviewGroup>
                          )}
                          <div style={{ color: '#999', fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CalendarOutlined />
                            {new Date(activity.startTime).toLocaleDateString('zh-CN')} ~ {new Date(activity.endTime).toLocaleDateString('zh-CN')}
                          </div>
                        </Card>
                      ))}
                      <div style={{ color: '#999', fontSize: 13, textAlign: 'center', marginTop: 12 }}>
                        共 {activitiesTotal} 个活动
                      </div>
                    </>
                  )}
                </Spin>
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default MerchantDetail
