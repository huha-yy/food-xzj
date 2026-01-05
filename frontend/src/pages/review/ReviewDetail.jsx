import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Avatar,
  Tag,
  Button,
  Space,
  Divider,
  Empty,
  message,
  Spin,
  Descriptions,
  Row,
  Col
} from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  ShoppingOutlined,
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { getReviewDetail, likeReview, dislikeReview, cancelInteraction } from '@/api/review'
import './ReviewDetail.css'

const ReviewDetail = () => {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)

  // 获取评价详情
  useEffect(() => {
    fetchReviewDetail()
  }, [reviewId])

  const fetchReviewDetail = async () => {
    try {
      setLoading(true)
      const response = await getReviewDetail(reviewId)
      setReview(response)
    } catch (error) {
      message.error('获取评价详情失败')
    } finally {
      setLoading(false)
    }
  }

  // 点赞
  const handleLike = async () => {
    try {
      await likeReview(reviewId)
      message.success('点赞成功')
      fetchReviewDetail()
    } catch (error) {
      message.error('点赞失败')
    }
  }

  // 踩
  const handleDislike = async () => {
    try {
      await dislikeReview(reviewId)
      message.success('踩成功')
      fetchReviewDetail()
    } catch (error) {
      message.error('踩失败')
    }
  }

  // 取消互动
  const handleCancelInteraction = async () => {
    try {
      await cancelInteraction(reviewId)
      message.success('取消成功')
      fetchReviewDetail()
    } catch (error) {
      message.error('取消失败')
    }
  }

  // 渲染星星评分
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarOutlined
          key={i}
          style={{ color: i <= rating ? '#faad14' : '#d9d9d9', marginRight: 4 }}
        />
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className="review-detail-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!review) {
    return (
      <div className="review-detail-empty">
        <Empty description="评价不存在或已被删除" />
      </div>
    )
  }

  return (
    <div className="review-detail">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      {/* 评价详情卡片 */}
      <Card className="review-card">
        {/* 用户信息 */}
        <div className="review-header">
          <Avatar
            size={48}
            src={review.avatar}
            icon={<UserOutlined />}
          />
          <div className="user-info">
            <div className="username">{review.username}</div>
            <div className="time">{new Date(review.createTime).toLocaleString('zh-CN')}</div>
          </div>
        </div>

        <Divider />

        {/* 商家和菜品信息 */}
        <Descriptions column={1} bordered className="review-descriptions">
          <Descriptions.Item label="商家名称">
            <Space>
              <ShopOutlined />
              <span>{review.shopName}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="菜品名称">
            <Space>
              <ShoppingOutlined />
              <span>{review.foodName}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="评分">
            <Space>
              {renderStars(review.rating)}
              <span style={{ marginLeft: 8 }}>{review.rating}分</span>
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* 评价内容 */}
        {review.content && (
          <div className="review-content">
            <h4>评价内容：</h4>
            <p>{review.content}</p>
          </div>
        )}

        {/* 评价图片 */}
        {review.imageUrls && review.imageUrls.length > 0 && (
          <div className="review-images">
            <h4>评价图片：</h4>
            <Row gutter={[16, 16]}>
              {review.imageUrls.map((url, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <img
                    src={url}
                    alt={`评价图片${index + 1}`}
                    className="review-image"
                    onClick={() => window.open(url, '_blank')}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Divider />

        {/* 互动操作 */}
        <div className="review-actions">
          <Space size="large">
            {!review.isLiked && !review.isDisliked ? (
              <>
                <Button
                  icon={<LikeOutlined />}
                  onClick={handleLike}
                  style={{ color: '#52c41a' }}
                >
                  点赞 {review.likeCount}
                </Button>
                <Button
                  icon={<DislikeOutlined />}
                  onClick={handleDislike}
                  style={{ color: '#ff4d4f' }}
                >
                  踩 {review.dislikeCount}
                </Button>
              </>
            ) : review.isLiked ? (
              <Button
                icon={<LikeOutlined />}
                onClick={handleCancelInteraction}
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                已点赞 {review.likeCount}
              </Button>
            ) : (
              <Button
                icon={<DislikeOutlined />}
                onClick={handleCancelInteraction}
                type="primary"
                danger
              >
                已踩 {review.dislikeCount}
              </Button>
            )}
          </Space>
        </div>

        {/* 审核状态 */}
        {review.auditStatus && (
          <div className="review-status">
            <Tag color={
              review.auditStatus === 'APPROVED' ? 'green' :
              review.auditStatus === 'REJECTED' ? 'red' : 'orange'
            }>
              {review.auditStatus === 'APPROVED' ? '已通过' :
               review.auditStatus === 'REJECTED' ? '已驳回' : '待审核'}
            </Tag>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReviewDetail
