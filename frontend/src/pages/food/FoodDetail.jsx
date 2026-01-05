import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Rate, Button, Tag, List, Avatar, message, Spin, Empty, Tabs } from 'antd'
import { HeartOutlined, ShopOutlined, StarOutlined, ArrowLeftOutlined, LikeOutlined, DislikeOutlined, EditOutlined } from '@ant-design/icons'
import { getFoodDetail } from '@/api/food'
import { getReviewList, likeReview, dislikeReview, cancelInteraction } from '@/api/review'
import { createCollection, deleteCollection, checkCollection, getCollectionList } from '@/api/collection'
import ReviewModal from '@/components/ReviewModal'
import './FoodDetail.css'

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
  const pageSize = 10

  // 获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isStudent = userInfo?.role === 'STUDENT'

  useEffect(() => {
    // 检查 id 是否存在
    if (!id) {
      message.error('菜品ID不存在')
      navigate('/')
      return
    }

    fetchFoodDetail()
    fetchReviews()
    // 所有登录用户都检查收藏状态
    checkCollectionStatus()
  }, [id])

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
        pageSize
      })
      setReviews(data?.records || [])
      setTotal(data?.total || 0)
    } catch (error) {
      console.error('获取评价列表失败:', error)
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

  const goBack = () => {
    navigate(-1)
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
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      {/* 菜品信息 */}
      <Card
        title="菜品详情"
        className="food-info-card"
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="菜品名称">
            <span className="food-name">{food.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="价格">
            <Tag color="red" className="price-tag">¥{food.price}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="分类">
            <Tag color="blue">{food.categoryName}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="评分">
            <Rate
              disabled
              defaultValue={Number(food.ratingAvg)}
              allowHalf
              style={{ fontSize: 14 }}
            />
            <span className="rating-text">{food.ratingAvg}分</span>
          </Descriptions.Item>
          <Descriptions.Item label="销量">
            <Tag color="orange">{food.salesCount}份</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={food.status === 'ON_SHELF' ? 'green' : 'red'}>
              {food.status === 'ON_SHELF' ? '在售' : '已下架'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="菜品描述" span={2}>
            {food.description || '暂无描述'}
          </Descriptions.Item>
        </Descriptions>

        {/* 菜品图片 */}
        {food.imageUrl && (
          <div className="food-image">
            <img src={food.imageUrl} alt={food.name} />
          </div>
        )}

        {/* 收藏按钮（所有登录用户都可以看到） */}
        <Button
          type={isCollected ? 'default' : 'primary'}
          icon={<HeartOutlined />}
          onClick={handleCollection}
          size="large"
          className="collection-btn"
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
            style={{ marginTop: 12 }}
          >
            发表评价
          </Button>
        )}
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

      {/* 评价列表 */}
      <Card
        title="用户评价"
        className="review-card"
        extra={
          <span className="review-count">共 {total} 条评价</span>
        }
      >
        {reviews.length > 0 ? (
          <List
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item className="review-item">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={review.avatar}
                      icon={<StarOutlined />}
                      size="large"
                    />
                  }
                  title={
                    <div className="review-header">
                      <span className="username">{review.username}</span>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        allowHalf
                        style={{ fontSize: 12 }}
                      />
                      <span className="review-time">{review.createTime}</span>
                    </div>
                  }
                  description={
                    <div className="review-content">
                      <div className="review-text">{review.content}</div>
                      {/* 评价图片 */}
                      {review.imageUrls && review.imageUrls.length > 0 && (
                        <div className="review-images">
                          {review.imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`评价图片${index + 1}`}
                              className="review-image"
                            />
                          ))}
                        </div>
                      )}
                      <div className="review-interactions">
                        <Button
                          type="text"
                          size="small"
                          icon={<LikeOutlined />}
                          onClick={() => handleLike(review.reviewId)}
                          disabled={review.isLiked}
                        >
                          {review.likeCount}
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<DislikeOutlined />}
                          onClick={() => handleDislike(review.reviewId)}
                          disabled={review.isDisliked}
                        >
                          {review.dislikeCount}
                        </Button>
                        {review.isLiked && (
                          <Button
                            type="text"
                            size="small"
                            onClick={() => handleCancelInteraction(review.reviewId)}
                          >
                            取消
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无评价" />
        )}
      </Card>
    </div>
  )
}

export default FoodDetail
