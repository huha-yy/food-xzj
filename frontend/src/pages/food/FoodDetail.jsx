import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Rate, Button, Tag, List, Avatar, message, Spin, Empty, Select, Progress, Input } from 'antd'
import {
  HeartOutlined,
  HeartFilled,
  ShopOutlined,
  StarOutlined,
  ArrowLeftOutlined,
  LikeOutlined,
  DislikeOutlined,
  EditOutlined,
  FireOutlined,
  CoffeeOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { getFoodDetail } from '@/api/food'
import { getReviewList, likeReview, dislikeReview, cancelInteraction, getRatingDistribution, createReviewReply, deleteReviewReply } from '@/api/review'
import { createCollection, deleteCollection, checkCollection, getCollectionList } from '@/api/collection'
import ReviewModal from '@/components/ReviewModal'
import './FoodDetail.css'

const { Option } = Select
const { TextArea } = Input

function FoodDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [food, setFood] = useState(null)
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [isCollected, setIsCollected] = useState(false)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [reviewPage, setReviewPage] = useState(1)
  const [ratingDistribution, setRatingDistribution] = useState(null)
  const [sortBy, setSortBy] = useState('time')
  const [sortOrder, setSortOrder] = useState('desc')
  const [ratingFilter, setRatingFilter] = useState(null)
  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingReplyId, setEditingReplyId] = useState(null)
  const [editReplyContent, setEditReplyContent] = useState('')
  const pageSize = 10

  // 获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isStudent = userInfo?.role === 'STUDENT'
  const isMerchant = userInfo?.role === 'MERCHANT'

  useEffect(() => {
    // 检查 id 是否存在
    if (!id) {
      message.error('菜品ID不存在')
      navigate('/')
      return
    }

    fetchFoodDetail()
    fetchReviews()
    fetchRatingDistribution()
    // 所有登录用户都检查收藏状态
    checkCollectionStatus()
  }, [id])

  useEffect(() => {
    fetchReviews(reviewPage)
  }, [sortBy, sortOrder, ratingFilter])

  const fetchFoodDetail = async () => {
    try {
      setLoading(true)
      const data = await getFoodDetail(id)
      setFood(data)
    } catch (error) {
      console.error('获取菜品详情失败:', error)
      message.error('获取菜品详情失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (page = 1) => {
    if (!id) {
      console.error('菜品ID不存在，无法获取评价列表')
      return
    }

    try {
      const data = await getReviewList({
        foodId: id,
        current: page,
        pageSize,
        sortBy,
        sortOrder,
        rating: ratingFilter
      })
      console.log('获取到的评价列表数据:', data)
      console.log('第一条评价的标签:', data?.records?.[0]?.tags)
      setReviews(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取评价列表失败:', error)
    }
  }

  const fetchRatingDistribution = async () => {
    if (!id) return
    try {
      const data = await getRatingDistribution(id)
      setRatingDistribution(data)
    } catch (error) {
      console.error('获取评分分布失败:', error)
    }
  }

  const checkCollectionStatus = async () => {
    if (!id) {
      console.error('菜品ID不存在，无法检查收藏状态')
      setIsCollected(false)
      return
    }

    try {
      const result = await checkCollection(id, 'FOOD')
      setIsCollected(result === true)
    } catch (error) {
      console.error('检查收藏状态失败:', error)
    }
  }

  const handleCollection = async () => {
    try {
      if (isCollected) {
        // 取消收藏
        const collectionList = await getCollectionList({ type: 'FOOD', current: 1, pageSize: 1000 })
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
          type: 'FOOD',
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

  const handleLike = async (reviewId) => {
    try {
      await likeReview(reviewId)
      message.success('点赞成功')
      fetchReviews(reviewPage)
    } catch (error) {
      console.error('点赞失败:', error)
      message.error('操作失败')
    }
  }

  const handleDislike = async (reviewId) => {
    try {
      await dislikeReview(reviewId)
      message.success('踩成功')
      fetchReviews(reviewPage)
    } catch (error) {
      console.error('踩失败:', error)
      message.error('操作失败')
    }
  }

  const handleCancelInteraction = async (reviewId) => {
    try {
      await cancelInteraction(reviewId)
      message.success('已取消')
      fetchReviews(reviewPage)
    } catch (error) {
      console.error('取消操作失败:', error)
      message.error('操作失败')
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyContent.trim()) {
      message.error('请输入回复内容')
      return
    }
    try {
      await createReviewReply({
        reviewId,
        content: replyContent
      })
      message.success('回复成功')
      setReplyingReviewId(null)
      setReplyContent('')
      fetchReviews(reviewPage)
    } catch (error) {
      console.error('回复失败:', error)
      message.error(error.response?.data?.message || '回复失败')
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
      fetchReviews(reviewPage)
    } catch (error) {
      message.error('修改失败')
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  const goToMerchant = () => {
    if (food?.merchantId) {
      navigate(`/merchants/${food.merchantId}`)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!food) {
    return (
      <Empty description="菜品不存在" />
    )
  }

  return (
    <div className="food-detail">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={goBack}
        className="back-btn"
      >
        返回
      </Button>

      {/* 菜品主卡片 */}
      <Card className="food-main-card">
        <div className="food-detail-content">
          {/* 左侧图片区域 */}
          <div className="food-image-section">
            {/* 状态标签 */}
            <span className={`food-status-badge ${food.status === 'ON_SHELF' ? 'on-shelf' : 'off-shelf'}`}>
              {food.status === 'ON_SHELF' ? '在售' : '已下架'}
            </span>

            {food.imageUrl ? (
              <img src={food.imageUrl} alt={food.name} />
            ) : (
              <div className="food-image-placeholder">
                <CoffeeOutlined className="placeholder-icon" />
                <span>暂无图片</span>
              </div>
            )}
          </div>

          {/* 右侧信息区域 */}
          <div className="food-info-section">
            <div className="food-header">
              <h1 className="food-name">
                {food.name}
                <Tag className="food-category-tag">{food.categoryName}</Tag>
              </h1>
              <div className="food-merchant" onClick={goToMerchant}>
                <ShopOutlined />
                <span>{food.merchantName}</span>
              </div>
            </div>

            {/* 价格和评分 */}
            <div className="food-price-rating">
              <div className="food-price">
                <span className="price-label">价格</span>
                <span className="price-value">
                  <small>¥</small>{food.price}
                </span>
              </div>
              <div className="food-rating-info">
                <span className="rating-label">用户评分</span>
                <div className="rating-content">
                  <Rate
                    disabled
                    defaultValue={Number(food.ratingAvg)}
                    allowHalf
                  />
                  <span className="rating-score">{food.ratingAvg || '0.0'}分</span>
                </div>
              </div>
            </div>

            {/* 销量信息 */}
            <div className="food-stats">
              <div className="stat-item">
                <FireOutlined />
                <span>月销量 <strong>{food.salesCount}</strong> 份</span>
              </div>
              <div className="stat-item">
                <StarOutlined />
                <span>评价 <strong>{total}</strong> 条</span>
              </div>
            </div>

            {/* 菜品描述 */}
            <div className="food-description">
              <h4>菜品描述</h4>
              <p>{food.description || '暂无描述'}</p>
            </div>

            {/* 操作按钮 */}
            <div className="food-actions">
              <Button
                type={isCollected ? 'default' : 'primary'}
                icon={isCollected ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleCollection}
                size="large"
                className={`collection-btn ${isCollected ? 'collected' : ''}`}
              >
                {isCollected ? '已收藏' : '收藏'}
              </Button>

              {/* 发表评价按钮（只有学生才显示） */}
              {isStudent && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setReviewModalVisible(true)}
                  size="large"
                  className="review-btn"
                >
                  发表评价
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 评价Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        foodId={id}
        foodName={food?.name}
        onCancel={() => setReviewModalVisible(false)}
        onSuccess={() => {
          setReviewModalVisible(false)
          fetchReviews(reviewPage)
        }}
      />

      {/* 评分分布 */}
      {ratingDistribution && (
        <Card className="rating-distribution-card" title="评分分布">
          <div className="rating-summary">
            <div className="rating-score">
              <div className="score-number">{ratingDistribution.averageRating}</div>
              <Rate disabled value={ratingDistribution.averageRating} allowHalf />
              <div className="score-total">共 {ratingDistribution.totalCount} 条评价</div>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map(star => {
                // 使用对象映射，更清晰准确
                const starCountMap = {
                  5: ratingDistribution.fiveStarCount,
                  4: ratingDistribution.fourStarCount,
                  3: ratingDistribution.threeStarCount,
                  2: ratingDistribution.twoStarCount,
                  1: ratingDistribution.oneStarCount
                }
                const count = starCountMap[star] || 0
                const percent = ratingDistribution.totalCount > 0 ? (count / ratingDistribution.totalCount * 100).toFixed(1) : 0
                return (
                  <div key={star} className="rating-bar-item">
                    <span className="star-label">{star}星</span>
                    <Progress
                      percent={percent}
                      strokeColor="#1677ff"
                      showInfo={false}
                      style={{ flex: 1 }}
                    />
                    <span className="count-label">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* 评价列表 */}
      <Card
        title={
          <div className="review-card-title">
            <StarOutlined />
            <span>用户评价</span>
          </div>
        }
        className="review-card"
        extra={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Select
              value={ratingFilter}
              onChange={setRatingFilter}
              style={{ width: 120 }}
              placeholder="评分筛选"
              allowClear
            >
              <Option value={5}>5星</Option>
              <Option value={4}>4星</Option>
              <Option value={3}>3星</Option>
              <Option value={2}>2星</Option>
              <Option value={1}>1星</Option>
            </Select>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
            >
              <Option value="time">按时间</Option>
              <Option value="hot">按热度</Option>
              <Option value="rating">按评分</Option>
            </Select>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ width: 100 }}
            >
              <Option value="desc">降序</Option>
              <Option value="asc">升序</Option>
            </Select>
            <span className="review-count">共 {total} 条</span>
          </div>
        }
      >
        {reviews.length > 0 ? (
          <div className="review-list-wrapper">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-item-card">
                <div className="review-item-header">
                  <div className="review-user-info">
                    <Avatar
                      src={review.avatar}
                      icon={<StarOutlined />}
                      size={48}
                      className="review-avatar"
                    />
                    <div className="review-user-detail">
                      <div className="review-username">{review.username}</div>
                      <div className="review-time">{review.createTime}</div>
                    </div>
                  </div>
                  <div className="review-rating-box">
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      allowHalf
                      className="review-stars"
                    />
                    <span className="review-score">{review.rating}分</span>
                  </div>
                </div>

                <div className="review-item-body">
                  <p className="review-text">{review.content}</p>

                  {/* 评价标签 */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="review-tags" style={{ marginTop: '8px', marginBottom: '8px' }}>
                      {review.tags.map(tag => (
                        <Tag
                          key={tag.tagId}
                          color={
                            tag.type === 'POSITIVE' ? 'green' :
                            tag.type === 'NEGATIVE' ? 'red' : 'blue'
                          }
                        >
                          {tag.name}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* 评价图片 */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="review-images">
                      {review.imageUrls.map((url, index) => (
                        <div key={index} className="review-image-wrapper">
                          <img
                            src={url}
                            alt={`评价图片${index + 1}`}
                            className="review-image"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 商家回复 */}
                  {review.reply && (
                    <div className="merchant-reply" style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px'
                    }}>
                      {editingReplyId === review.reply.replyId ? (
                        <>
                          <TextArea
                            rows={3}
                            value={editReplyContent}
                            onChange={(e) => setEditReplyContent(e.target.value)}
                            maxLength={500}
                            showCount
                          />
                          <div style={{ marginTop: '8px', textAlign: 'right' }}>
                            <Button
                              size="small"
                              onClick={() => { setEditingReplyId(null); setEditReplyContent('') }}
                              style={{ marginRight: '8px' }}
                            >
                              取消
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleEditReply(review.reply.replyId, review.reviewId)}
                            >
                              保存
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1677ff' }}>
                            <ShopOutlined /> {review.reply.shopName} 回复：
                          </div>
                          <div>{review.reply.content}</div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{review.reply.createTime}</span>
                            {isMerchant && userInfo?.merchantId === food?.merchantId && (
                              <Button
                                type="link"
                                size="small"
                                icon={<EditOutlined />}
                                style={{ padding: 0 }}
                                onClick={() => {
                                  setEditingReplyId(review.reply.replyId)
                                  setEditReplyContent(review.reply.content)
                                }}
                              >
                                修改
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="review-item-footer">
                  <div className="review-interactions">
                    <Button
                      type="text"
                      size="small"
                      icon={<LikeOutlined />}
                      onClick={() => handleLike(review.reviewId)}
                      disabled={review.isLiked}
                      className={`interaction-btn ${review.isLiked ? 'active' : ''}`}
                    >
                      {review.likeCount > 0 ? review.likeCount : '赞'}
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<DislikeOutlined />}
                      onClick={() => handleDislike(review.reviewId)}
                      disabled={review.isDisliked}
                      className={`interaction-btn ${review.isDisliked ? 'active' : ''}`}
                    >
                      {review.dislikeCount > 0 ? review.dislikeCount : '踩'}
                    </Button>
                    {(review.isLiked || review.isDisliked) && (
                      <Button
                        type="text"
                        size="small"
                        onClick={() => handleCancelInteraction(review.reviewId)}
                        className="cancel-btn"
                      >
                        取消
                      </Button>
                    )}
                    {isMerchant && !review.reply && userInfo?.merchantId === food?.merchantId && (
                      <Button
                        type="text"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => setReplyingReviewId(review.reviewId)}
                      >
                        回复
                      </Button>
                    )}
                  </div>

                  {/* 商家回复输入框 */}
                  {replyingReviewId === review.reviewId && (
                    <div style={{ marginTop: '12px' }}>
                      <TextArea
                        rows={3}
                        placeholder="输入回复内容..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        maxLength={500}
                        showCount
                      />
                      <div style={{ marginTop: '8px', textAlign: 'right' }}>
                        <Button
                          size="small"
                          onClick={() => {
                            setReplyingReviewId(null)
                            setReplyContent('')
                          }}
                          style={{ marginRight: '8px' }}
                        >
                          取消
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleReply(review.reviewId)}
                        >
                          发送
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无评价" />
        )}
      </Card>
    </div>
  )
}

export default FoodDetail
